using Flows;
using LiteDB;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
//using Microsoft.AspNetCore.SignalR;
//using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class AppsHub : Hub
    {
        private static string dbPath = Environment.CurrentDirectory + "\\Apps.db";

        //private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext();
        //IHubContext context = Startup.ConnectionManager.GetHubContext<ChatHub>();
        LiteDatabase AppsDB;

        public AppsHub(AppsData data)
        {
            //  _context = context;
            AppsDB = data.AppsDB;
        }

        public static void Load()
        {
            //Open signal client
            HubConnection connection = new HubConnectionBuilder().WithUrl("https://localhost:54321/appsHub").Build();

            Task startTask = connection.StartAsync();

            connection.On<string, string>("ReceivePing", (machineName, workingFolder) => {
                
            });

            connection.Closed += async (error) =>
            {
                await Task.Delay(new Random().Next(0, 5) * 1000);
                await connection.StartAsync();
            };
        }
        public async Task Log(string logJson)
        {

        }
        public async Task SendMessage(string user, string message)
        {
            //await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public async Task SendAppsClientConfig(AppsClient.AppsClientConfig config)
        {
            var result = new AppsClient.AppsResult();

            try
            {
                var objs = AppsDB.GetCollection<App>("Apps");
                var apps = objs.Query().Where(a => a.MachineName == config.MachineName && a.WorkingFolder == config.WorkingDirectory);
                if (apps.Count() == 0)
                {
                    var newApp = new App()
                    {
                        Created = DateTime.Now,
                        MachineName = config.MachineName,
                        WorkingFolder = config.WorkingDirectory,
                        Updated = DateTime.Now,
                        IsEnabled = true
                    };
                    
                    objs.Insert(newApp);

                    UpdateAppSoftwareFilesAndCodes(newApp, config, ref result);

                }
                else if (apps.Count() == 1)
                {
                    var existingApp = apps.Single();
                    existingApp.Updated = DateTime.Now;

                    objs.Upsert(existingApp);

                    UpdateAppSoftwareFilesAndCodes(existingApp, config, ref result);

                }
                else
                {
                    result.FailMessages.Add("Found more than one matching app for incoming config: " + apps.Count().ToString());
                }

            }
            catch (System.Exception ex)
            {
                //AppsLog.LogStep<Flows.AppsSystem.Initialize.Exception>(ex.ToString());
                new AppFlows.Helpers.AppsSystem.Exception(ex, ref result);
            }

        }

        private void UpdateAppSoftwareFilesAndCodes(App app, AppsClient.AppsClientConfig clientConfig, ref AppsClient.AppsResult result)
        {
            var softwareFilesDB = AppsDB.GetCollection<SoftwareFile>("SoftwareFiles");

            //Update software files
            foreach (string csFileFullName in clientConfig.CSFileFullNames)
            {
                if (System.IO.File.Exists(csFileFullName))
                {
                    string csContents = System.IO.File.ReadAllText(csFileFullName);

                    //Look for already-saved cs file in app
                    var existingFileList = app.SoftwareFiles.Where(f => f.FullName == csFileFullName);

                    if (existingFileList.Count() == 1)
                    {
                        //We've already gotten it, refresh and save
                        var existingFile = existingFileList.Single();
                        existingFile.Contents = csContents;
                        existingFile.FullName = csFileFullName;
                        existingFile.Updated = DateTime.Now;
                        existingFile.AppID = app.AppID;

                        softwareFilesDB.Upsert(existingFile);

                        UpdateCSFileCodes(existingFile, ref result);
                    }
                    else if (existingFileList.Count() == 0)
                    {
                        //Haven't seen this one, add it to app
                        var newFile = new SoftwareFile
                        {
                            Contents = csContents,
                            Created = DateTime.Now,
                            FileLanguage = SoftwareFileLanguages.CSharp,
                            FullName = csFileFullName,
                            AppID = app.AppID
                        };

                        softwareFilesDB.Insert(newFile);

                        app.SoftwareFiles.Add(newFile);

                        UpdateCSFileCodes(newFile, ref result);

                    }
                    else
                    {
                        result.FailMessages.Add("More than one copy of csfile in app: " + existingFileList.Count().ToString());
                    }
                }
                else
                {
                    result.FailMessages.Add("Incoming config cs file path not found.");
                }

                app.Updated = DateTime.Now;
            }

        }
        private void UpdateCSFileCodes(SoftwareFile softwareFile, ref AppsClient.AppsResult result)
        {
            var softwareFileCodeDB = AppsDB.GetCollection<SoftwareFileCode>("SoftwareFileCodes");

            Microsoft.CodeAnalysis.SyntaxTree tree = Microsoft.CodeAnalysis.CSharp.CSharpSyntaxTree.ParseText(softwareFile.Contents);
            var descendents = tree.GetRoot().DescendantNodes(); //.OfType<LiteralExpressionSyntax>();
            foreach(var desc in descendents)
            {
                if(desc.GetType().Name == "MethodDeclarationSyntax")
                {
                    var method = (MethodDeclarationSyntax)desc;
                    var existingCodeList = softwareFile.SoftwareFileCodes.Where(sc => sc.Name == method.Identifier.Text);
                    if(existingCodeList.Count() == 1)
                    {
                        var existingCode = existingCodeList.Single();
                        existingCode.CodeType = SoftwareFileCodeTypes.Method;
                        existingCode.Contents = method.Body.ToFullString();
                        existingCode.Name = method.Identifier.Text;
                        existingCode.SoftwareFileID = softwareFile.SoftwareFileID;

                        softwareFileCodeDB.Upsert(existingCode);

                    }
                    else if(existingCodeList.Count() == 0)
                    {
                        var newCode = new SoftwareFileCode
                        {
                            CodeType = SoftwareFileCodeTypes.Method,
                            Contents = method.Body != null ? method.Body.ToFullString() : "",
                            Name = method.Identifier.Text,
                            SoftwareFileID = softwareFile.SoftwareFileID
                        };

                        softwareFileCodeDB.Insert(newCode);

                        softwareFile.SoftwareFileCodes.Add(newCode);
                    }
                    else
                    {
                        result.FailMessages.Add("More than one code found for " + method.Identifier.Text + " in file " + softwareFile.FullName);
                    }
                }
            }
            //var codeList = softwareFile.SoftwareFileCodes.Where(code => code.SoftwareFileCodeID == softwareFile.)
            //foreach (var fileCode in softwareFile.SoftwareFileCodes)
            //{
            
            //}
        }
        public async Task Ping(string machineName, string workingFolder)
        {
            await Clients.All.SendAsync("Ping", machineName, workingFolder);
        }


    }

}

using AppsDesktop;
using Brooksoft.Apps.Business;
using Flows;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Business
{
    public static class AppsHelper
    {
        public static void RegisterClient(AppsData data, LiteDB.LiteDatabase appsDb, AppsClient.AppsClientConfig config, ref AppsClient.AppsResult result)
        {
            var objs = appsDb.GetCollection<App>("Apps");
            var apps = objs.Query().Where(a => a.MachineName == config.MachineName && a.WorkingFolder == config.WorkingDirectory);
            App app = null;

            if (apps.Count() == 0)
            {
                app = new App()
                {
                    Created = DateTime.Now,
                    MachineName = config.MachineName,
                    WorkingFolder = config.WorkingDirectory,
                    Updated = DateTime.Now,
                    IsEnabled = true,
                    LocalHostPort = config.LocalHostPort
                };

                objs.Insert(app);
            }
            else if (apps.Count() == 1)
            {
                app = apps.Single();
                app.Updated = DateTime.Now;
                app.LocalHostPort = config.LocalHostPort;
                objs.Upsert(app);
            }
            else
            {
                new AppFlows.Helpers.AppsSystem.Fail("Found more than one matching app for incoming config: " + apps.Count().ToString(), ref result);
            }

            var client = new Client(app, ref result);

            AppsHelper.UpdateAppSoftwareFilesAndCodes(client, config, ref result);
        }
        private static void UpdateAppSoftwareFilesAndCodes(Client client, AppsClient.AppsClientConfig clientConfig, ref AppsClient.AppsResult result)
        {
            var softwareFilesDB = client.DB.GetCollection<SoftwareFile>("SoftwareFiles");

            //softwareFilesDB.DeleteMany(sf => sf.AppID == client.App.AppID);
            
            //Update software files
            foreach (string csFileFullName in clientConfig.CSFileFullNames)
            {
                if (System.IO.File.Exists(csFileFullName))
                {
                    string csContents = System.IO.File.ReadAllText(csFileFullName);

                    //Look for already-saved cs file in app
                    var existingFileList = client.App.SoftwareFiles.Where(f => f.FullName == csFileFullName);

                    if (existingFileList.Count() == 1)
                    {
                        //We've already gotten it, refresh and save
                        var existingFile = existingFileList.Single();
                        existingFile.Contents = csContents;
                        existingFile.FullName = csFileFullName;
                        existingFile.Updated = DateTime.Now;
                        existingFile.AppID = client.App.AppID;

                        softwareFilesDB.Upsert(existingFile);

                        UpdateCSFileCodes(client, existingFile, ref result);
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
                            AppID = client.App.AppID
                        };

                        softwareFilesDB.Insert(newFile);

                        client.App.SoftwareFiles.Add(newFile);

                        UpdateCSFileCodes(client, newFile, ref result);
                    }
                    else
                        new AppFlows.Helpers.AppsSystem.Fail("More than one copy of csfile in app: " + existingFileList.Count().ToString(), ref result);
                }
                else
                    new AppFlows.Helpers.AppsSystem.Fail("Incoming config cs file path not found.", ref result);

                client.App.Updated = DateTime.Now;
            }
        }
        private static void UpdateCSFileCodes(Client client, SoftwareFile softwareFile, ref AppsClient.AppsResult result)
        {
            var softwareFileCodeDB = client.DB.GetCollection<SoftwareFileCode>("SoftwareFileCodes");

            Microsoft.CodeAnalysis.SyntaxTree tree = Microsoft.CodeAnalysis.CSharp.CSharpSyntaxTree.ParseText(softwareFile.Contents);
            var descendents = tree.GetRoot().DescendantNodes(); //.OfType<LiteralExpressionSyntax>();
            foreach (var desc in descendents)
            {
                if (desc.GetType().Name == "MethodDeclarationSyntax")
                {
                    var method = (MethodDeclarationSyntax)desc;

                    var existingCodeList = softwareFile.SoftwareFileCodes.Where(sc => sc.Name == method.Identifier.Text);
                    if (existingCodeList.Count() == 1)
                    {
                        var existingCode = existingCodeList.Single();
                        existingCode.CodeType = SoftwareFileCodeTypes.Method;
                        existingCode.Contents = method.Body.ToFullString();
                        existingCode.Name = method.Identifier.Text;
                        existingCode.SoftwareFileID = softwareFile.SoftwareFileID;

                        softwareFileCodeDB.Upsert(existingCode);

                    }
                    else if (existingCodeList.Count() == 0)
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
        }

    }
}

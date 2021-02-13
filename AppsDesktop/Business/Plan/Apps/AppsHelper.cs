using AppsDesktop;
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
            if (apps.Count() == 0)
            {
                var newApp = new App()
                {
                    Created = DateTime.Now,
                    MachineName = config.MachineName,
                    WorkingFolder = config.WorkingDirectory,
                    Updated = DateTime.Now,
                    IsEnabled = true,
                    LocalHostPort = config.LocalHostPort
                };

                objs.Insert(newApp);

                AppsHelper.UpdateAppSoftwareFilesAndCodes(data, appsDb, newApp, config, ref result);
                data.UpsertAppDB(newApp, ref result);
            }
            else if (apps.Count() == 1)
            {
                var existingApp = apps.Single();
                existingApp.Updated = DateTime.Now;
                existingApp.LocalHostPort = config.LocalHostPort;
                objs.Upsert(existingApp);

                AppsHelper.UpdateAppSoftwareFilesAndCodes(data, appsDb, existingApp, config, ref result);
                data.UpsertAppDB(existingApp, ref result);
            }
            else
                new AppFlows.Helpers.AppsSystem.Fail("Found more than one matching app for incoming config: " + apps.Count().ToString(), ref result);

        }
        private static void UpdateAppSoftwareFilesAndCodes(AppsData data, LiteDB.LiteDatabase appsDb, App app, AppsClient.AppsClientConfig clientConfig, ref AppsClient.AppsResult result)
        {
            var appDBList = data.ClientAppsDBs.Where(cdb => cdb.App.AppID == app.AppID);
            if (appDBList.Count() == 1)
            {
                var appDB = appDBList.Single().AppsDB;

                var softwareFilesDB = appDB.GetCollection<SoftwareFile>("SoftwareFiles");

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

                            UpdateCSFileCodes(data, appsDb, app, existingFile, ref result);
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

                            UpdateCSFileCodes(data, appsDb, app, newFile, ref result);
                        }
                        else
                            new AppFlows.Helpers.AppsSystem.Fail("More than one copy of csfile in app: " + existingFileList.Count().ToString(), ref result);
                    }
                    else
                        new AppFlows.Helpers.AppsSystem.Fail("Incoming config cs file path not found.", ref result);

                    app.Updated = DateTime.Now;
                }
            }
            else
                new AppFlows.Helpers.AppsSystem.Fail("Not exactly one db.", ref result);
        }
        private static void UpdateCSFileCodes(AppsData data, LiteDB.LiteDatabase appsDb, App app, SoftwareFile softwareFile, ref AppsClient.AppsResult result)
        {
            var appDBList = data.ClientAppsDBs.Where(cdb => cdb.App.AppID == app.AppID);
            if (appDBList.Count() == 1)
            {
                var appDB = appDBList.Single().AppsDB;
                var softwareFileCodeDB = appsDb.GetCollection<SoftwareFileCode>("SoftwareFileCodes");

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
            else
                new AppFlows.Helpers.AppsSystem.Fail("Not exactly one db.", ref result);
        }

    }
}

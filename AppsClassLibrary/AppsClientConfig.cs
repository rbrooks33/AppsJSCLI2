using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AppsClient
{
    public class AppsClientConfig : IAppsClientConfig
    {
        [Key]
        public int ID { get; set; }
        public string MachineName { get; set; }
        public string WorkingDirectory { get; set; }
        public Version VersionNumber { get; set; }
        public List<string> Services { get; set; }
        public List<AppsCustomConfigItem> CustomConfigs { get; set; }
        public List<string> CSFileFullNames { get; set; }
        private string SearchPattern { get; set; }
        public Flows.AppFlow Flows { get; set; }

        public void Load(string projectName, string machineName, string workingDirectory, System.Version versionNumber, List<string> services, List<AppsCustomConfigItem> customConfigs, bool readFlows, bool logFlows, Flows.AppFlow flows)
        {
            MachineName = machineName;
            WorkingDirectory = workingDirectory;
            VersionNumber = versionNumber;
            Services = services;
            CustomConfigs = customConfigs;
            AppsLog.LogFlows = logFlows;
            Flows = flows;
            //Create sample flows


            //string configPath = Environment.CurrentDirectory + "\\AppsClient.json";
            //if (!File.Exists(configPath))
            //{
            //    //File is write-once, hand-edit and read-many (to reset delete file)
            //    string configJson = Newtonsoft.Json.JsonConvert.SerializeObject(this);
            //    File.WriteAllText(configPath, configJson);
            //}

            ////Start SignalR and Set global connection obj
            AppsClientHub.Load();

            ////Load logging info
            AppsLog.Load(machineName);


            CSFileFullNames = new List<string>();
            SearchPattern = "*.cs";
            SearchDirectories(new System.IO.DirectoryInfo(Environment.CurrentDirectory));

            ////Send config
            AppsClientHub.SendConfig(this);

            //string appDrive = workingDirectory.Substring(0, 1);
            //string appFolderPath = workingDirectory.Substring(2);
            //string appFolder = $@"\\{machineName}\{appDrive}$\{appFolderPath}";

            //if(Directory.Exists(appFolder))
            //{

            //}

            //if (readFlows)
            //{
            //    //Create flows class
            //    string csFileFullPath = workingDirectory + "\\AppsFlows.cs";

            //    File.Delete(csFileFullPath);

            //    string flowsJson = File.ReadAllText(workingDirectory + "\\AppsClient.json");
            //    JObject obj = Newtonsoft.Json.JsonConvert.DeserializeObject<JObject>(flowsJson);
            //    foreach (var props in obj)
            //    {
            //        var propName = (JValue)(props).Key;

            //        if (propName.ToString() == "Flows")
            //        {

            //            //var flowsClass = SyntaxFactory.ClassDeclaration("Flows");
            //            //flowsClass = flowsClass.AddModifiers(SyntaxFactory.Token(SyntaxKind.PublicKeyword));
            //            //flowsClass = flowsClass.AddModifiers(SyntaxFactory.Token(SyntaxKind.StaticKeyword));


            //            //flowsClass = flowsClass.AddMembers(flow1class);

            //            //ns = ns.AddMembers(flowsClass).NormalizeWhitespace();

            //            var ns = SyntaxFactory.NamespaceDeclaration(SyntaxFactory.ParseName("Flows")).NormalizeWhitespace();
            //            System.IO.TextWriter writeFile = new StreamWriter(csFileFullPath);

            //            var propValue = (JArray)(props).Value;

            //            foreach (var flows in propValue)
            //            {
            //                foreach (var flow in flows)
            //                {
            //                    JProperty flowProp = (JProperty)flow;

            //                    var flowName = flowProp.Name;

            //                    var flowClass = SyntaxFactory.ClassDeclaration(flowName);
            //                    flowClass = flowClass.AddModifiers(SyntaxFactory.Token(SyntaxKind.PublicKeyword));
            //                    //flowClass = flowClass.AddModifiers(SyntaxFactory.Token(SyntaxKind.StaticKeyword));

            //                    foreach (var steps in flow)
            //                    {
            //                        foreach (var step in steps)
            //                        {
            //                            string stepName = step.ToString();

            //                            var stepClass = SyntaxFactory.ClassDeclaration(stepName);
            //                            stepClass = stepClass.AddModifiers(SyntaxFactory.Token(SyntaxKind.PublicKeyword));
            //                            //stepClass = stepClass.AddModifiers(SyntaxFactory.Token(SyntaxKind.StaticKeyword));

            //                            flowClass = flowClass.AddMembers(stepClass);
            //                        }
            //                    }

            //                    ns = ns.AddMembers(flowClass);
            //                }

            //            }
            //            ns.NormalizeWhitespace().WriteTo(writeFile);
            //            writeFile.Flush();
            //            writeFile.Close();

            //        }
            //    }
            //}
            //AppsLog.LogStep(new AppsFlows.Initialize.SendConfig());

            //using (FileSystemWatcher fsw = new FileSystemWatcher())
            //{
            //    fsw.Path = workingDirectory;
            //    fsw.Filter = "*.cs";

            //    fsw.Changed += OnChanged;
            //    fsw.Created += OnChanged;
            //    fsw.Deleted += OnChanged;
            //    fsw.Renamed += OnChanged;

            //    // Begin watching.
            //    fsw.EnableRaisingEvents = true;
            //}
        }

        //private static void OnChanged(object source, FileSystemEventArgs e)
        //{ 
        //    AppsHub.SendFileChange(e); 
        //}
        private void SearchDirectories(DirectoryInfo di)
        {
            SearchFiles(di);

            foreach (DirectoryInfo subdi in di.GetDirectories())
            {
                SearchDirectories(subdi);
            }
        }
        private void SearchFiles(DirectoryInfo di)
        {
            foreach (FileInfo fi in di.GetFiles(this.SearchPattern))
            {
                CSFileFullNames.Add(fi.FullName);
            }
        }
    }

}

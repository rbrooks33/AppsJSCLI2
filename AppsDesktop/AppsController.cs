using AppsClient;
using AppsDesktop.Models.Software;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AppsDesktop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppsController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;

        public AppsController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
        }

        [HttpPost]
        [Route("AppsServer")]
        public AppsResult AppsServer([FromBody]AppsParameters parameters)
        {
            var result = new AppsResult();


            return result;
        }
        [HttpGet]
        [Route("GetAppModel")]
        public AppsResult GetAppsModel()
        {
            return new AppsResult() { Data = new App(), Success = true };
        }
        [HttpGet]
        [Route("GetApp")]
        public AppsResult GetApp(int appId)
        {
            var result = new AppsResult();

            try
            {

                var objs = _db.GetCollection<App>("Apps"); // db.Softwares.Add(software);
                var publishProfiles = _db.GetCollection<PublishProfile>("PublishProfiles");
                var appList = objs.Query().Where(app => app.AppID == appId).ToList();
                foreach(var app in appList)
                {
                    app.PublishProfiles = publishProfiles.Query().Where(pp => pp.AppID == app.AppID).ToList();
                }
                result.Data = appList;
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Exception(ex, ref result);
            }

            return result;
        }

        public class GetAppsResult
        { 
            public GetAppsResult()
            {
                Apps = new List<App>();
                Systems = new List<Models.Software.System>();
                SoftwareFiles = new List<SoftwareFile>();
            }
            public List<App> Apps { get; set; }
            public List<Models.Software.System> Systems;
            public List<SoftwareFile> SoftwareFiles;
        }

        [HttpGet]
        [Route("GetApps")]
        public AppsResult GetApps()
        {
            var result = new AppsResult();
            var getAppsResult = new GetAppsResult();

            try
            {
                var apps = _db.GetCollection<App>("Apps");
                var systems = _db.GetCollection<Models.Software.System>("Systems");
                var softwareFiles = _db.GetCollection<SoftwareFile>("SoftwareFiles");
                var softwareFileCodes = _db.GetCollection<SoftwareFileCode>("SoftwareFileCodes");
                var publishProfiles = _db.GetCollection<PublishProfile>("PublishProfiles");

                //All Apps
                getAppsResult.Apps = apps.Query().ToList();

                foreach(var app in getAppsResult.Apps)
                {
                    app.PublishProfiles = publishProfiles.Query().Where(pp => pp.AppID == app.AppID).ToList();
                }

                //Apps in a system
                var distinctSystems = systems.Query().ToList().GroupBy(s => s.SystemID).ToList();
                foreach (var sys in distinctSystems)
                {
                    int sysId = sys.Key;
                    var system = systems.Query().Where(s => s.SystemID == sysId).ToList();
                    if (system.Count() == 1)
                    {
                        var sysApps = apps.Query().Where(a => a.SystemID == sysId).ToList();
                        system.Single().Apps.AddRange(sysApps);
                    }
                    getAppsResult.Systems.Add(system.Single());
                }

                foreach (var app in getAppsResult.Apps)
                {
                    app.SoftwareFiles.Clear();
                    //app.SoftwareFiles.AddRange(softwareFiles.Query().Where(sf => sf.AppID == app.AppID).ToList());
                    foreach (var softwareFile in app.SoftwareFiles)
                    {
                        softwareFile.SoftwareFileCodes.Clear();
                        softwareFile.SoftwareFileCodes.AddRange(softwareFileCodes.Query().Where(sfc => sfc.SoftwareFileID == softwareFile.SoftwareFileID).ToList());
                    }
                }

                new AppFlows.Plan.Apps.GetApps(getAppsResult.Apps.Count());

                result.Data = getAppsResult;
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Exception(ex, ref result);
            }

            return result;
        }

        [HttpPost]
        [Route("UpsertApp")]
        public AppsResult UpsertApp([FromBody] App app)
        {
            var result = new AppsResult();

            try
            {
                app.WorkingFolderExists = System.IO.Directory.Exists(app.WorkingFolder);
                app.ProjectFileExists = System.IO.File.Exists(app.ProjectFileFullName);

                var objs = _db.GetCollection<App>("Apps");
                objs.Upsert(app);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("GetPublishProfileModel")]
        public AppsResult GetPublishProfileModel()
        {
            return new AppsResult() { Data = new PublishProfile(), Success = true };
        }
        [HttpGet]
        [Route("GetPublishProfile")]
        public AppsResult GetPublishProfile(int publishProfileId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<PublishProfile>("PublishProfiles"); // db.Softwares.Add(software);

                var ppList = objs.Query().Where(pp => pp.PublishProfileID == publishProfileId).ToList();
                if(ppList.Count() == 1)
                {
                    result.Data = ppList.Single();
                    result.Success = true;
                }
                //else if(ppList.Count() == 0)
                //{
                //    //create one
                //    objs.Upsert(new PublishProfile())
                //}
                else
                {
                    new AppFlows.Publish.Fail("None or too many returned from get profile.", ref result);
                }
            }
            catch (System.Exception ex)
            {
                new AppFlows.Publish.Exception(ex, ref result);
            }

            return result;
        }
        [HttpPost]
        [Route("UpsertPublishProfile")]
        public AppsResult UpsertPublishProfile([FromBody] PublishProfile publishProfile)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<PublishProfile>("PublishProfiles");
                objs.Upsert(publishProfile);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Publish.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("GetSystemModel")]
        public AppsResult GetSystemModel()
        {
            return new AppsResult() { Data = new Models.Software.System(), Success = true };
        }
        [HttpGet]
        [Route("GetSystems")]
        public AppsResult GetSystems()
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Models.Software.System>("Systems"); // db.Softwares.Add(software);

                result.Data = objs.FindAll().ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Helpers.AppsSystem.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("GetSystem")]
        public AppsResult GetSystem(int systemId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Models.Software.System>("Systems");

                result.Data = objs.Query().Where(app => app.SystemID == systemId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Helpers.AppsSystem.Exception(ex, ref result);
            }

            return result;
        }
        [HttpPost]
        [Route("UpsertSystem")]
        public AppsResult UpsertSystem([FromBody] Models.Software.System system)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Models.Software.System>("Systems");
                objs.Upsert(system);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Helpers.AppsSystem.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("Compile")]
        public AppsResult Compile(string code)
        {
            var result = new AppsResult();

            try
            {
                Microsoft.CodeAnalysis.SyntaxTree tree = Microsoft.CodeAnalysis.CSharp.CSharpSyntaxTree.ParseText(code);
                var diags = tree.GetDiagnostics().ToList();
                foreach(var diag in diags)
                {
                    result.FailMessages.Add("(Start: " + diag.Location.SourceSpan.Start.ToString() + ", End: " + diag.Location.SourceSpan.End.ToString() + ") " + diag.Severity.ToString() + " " + diag.Descriptor.Id.ToString() + " " + diag.Descriptor.MessageFormat);  ;

                }
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Publish.Compile.Exception(ex, ref result);
            }

            return result;
        }

        [HttpPost]
        [Route("Publish")]
        public AppsResult Publish([FromBody]PublishProfile pp, string projectPath, string destinationFolder)
        {
            var result = new AppsResult();

            try
            {
                //Make sure there's an folder for this app
                System.IO.Directory.CreateDirectory(Environment.CurrentDirectory + "\\AppFolders\\App" + pp.AppID);

                //Pre-build
                if(pp.RunPreBuildScript)
                {
                    //Save to temp
                    string preBuildScriptPath = Environment.CurrentDirectory + "\\Business\\Ops\\PreBuildScripts\\App" + pp.AppID.ToString() + "PreBuild.csx";
                    System.IO.File.WriteAllText(preBuildScriptPath, pp.PreBuildScript);

                    Command.Exec("dotnet", "script", new Dictionary<string, string> {
                                {" ", "\"" + preBuildScriptPath + "\"" }
                            }, ref result);

                    new AppFlows.Publish.Success("Successfully ran pre-build script for " + pp.Name + ".");
                }

                if (System.IO.File.Exists(projectPath))
                {
                    if (System.IO.Directory.Exists(destinationFolder))
                    {

                        Command.Exec("dotnet", "publish", new Dictionary<string, string> {
                            {"-o", "\"" + destinationFolder + "\"" },
                            {"", "\"" + projectPath + "\""}
                        }, ref result);

                        if (!result.SuccessMessages.Any(sm => sm.Contains("error")))
                        {
                            result.Success = true;
                            new AppFlows.Publish.Success("Successfully executed publish for " + pp.Name + ".");

                            if (pp.RunPostBuildScript)
                            {
                                var compileResult = Compile(pp.PostBuildScript);
                                if (compileResult.Success)
                                {
                                    //Save to temp
                                    string scriptPath = Environment.CurrentDirectory + "\\Business\\Ops\\PostBuildScripts\\App" + pp.AppID.ToString() + "PostPublish.csx";
                                    System.IO.File.WriteAllText(scriptPath, pp.PostBuildScript);

                                    Command.Exec("dotnet", "script", new Dictionary<string, string> {
                                        {" ", "\"" + scriptPath + "\"" }
                                    }, ref result);

                                    new AppFlows.Publish.Success("Successfully ran post-publish script for " + pp.Name + ".");
                                }
                                else
                                {
                                    new AppFlows.Publish.Compile.Fail("Compile of post-publish script failed.", ref compileResult);
                                }
                            }
                            else
                                new AppFlows.Publish.Compile("Post-build scripts not enabled so not run.");
                        }
                        else
                            new AppFlows.Publish.Fail("Messages contain the work 'error'. Build and/or publish may have failed.", ref result);
                    }
                    else
                    {
                        new AppFlows.Publish.Fail("Cannot find destination folder.", ref result);
                    }
                }
                else
                {
                    new AppFlows.Publish.Fail("Cannot find project path.", ref result); 
                }
            }
            catch (System.Exception ex)
            {
                new AppFlows.Publish.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("LatestEvents")]
        public AppsResult LatestEvents(int secondsAgo)
        {
            var result = new AppsResult();

            try
            {
                var flows = new Flows.AppFlow();
                result.Data = flows.GetFlows();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Exception(ex, ref result);
            }

            return result;
        }

        [HttpGet]
        [Route("ArchiveEvents")]
        public AppsResult ArchiveEvents(string eventName)
        {
            var result = new AppsResult();

            try
            {
                result.Data = FlowsData.FlowTable.DeleteMany(e => e.FlowProps["Name"] == eventName.Replace(" ", "+"));
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Exception(ex, ref result);
            }

            return result;
        }
    }
}

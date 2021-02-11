using AppsClient;
using AppsClient.Docs;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace AppsDesktop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreateController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;

        public CreateController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
        }

        [HttpGet]
        [Route("CreateAppSoftware")]
        public AppsResult CreateAppSoftware(SoftwareTypes softwareType)
        {
            var result = new AppsResult();

            try
            {
                //1. Create new app object
                //2. Create new software object
                //3. Create "Software" folder under appfolders/app
                //4. Create "ID" folder under "Software"
                //5. Run new command

                var newApp = new App();
                var newSoftware = new Software();
                var appsTable = _db.GetCollection<App>("Apps"); 
                var softwaresTable = _db.GetCollection<Software>("Softwares");

                
                appsTable.Upsert(newApp); //Creates primary id
                softwaresTable.Upsert(newSoftware);

                string appFoldersFolder = System.Environment.CurrentDirectory + "\\AppFolders";
                
                if (System.IO.Directory.Exists(appFoldersFolder))
                {
                    System.IO.Directory.CreateDirectory(appFoldersFolder + "\\App" + newApp.AppID.ToString());
                    System.IO.Directory.CreateDirectory(appFoldersFolder + "\\App" + newApp.AppID.ToString() + "\\Software");
                    System.IO.Directory.CreateDirectory(appFoldersFolder + "\\App" + newApp.AppID.ToString() + "\\Software\\Software" + newSoftware.SoftwareID.ToString());

                    new AppFlows.Create(newApp.AppID, "Created all folders.");

                    if (softwareType == SoftwareTypes.CoreWebService)
                    {
                        newApp.AppName = "CoreWebService" + newApp.AppID.ToString();
                        newApp.MachineName = System.Environment.MachineName;
                        newApp.WorkingFolder = appFoldersFolder + "\\App" + newApp.AppID.ToString() + "\\Software\\Software" + newSoftware.SoftwareID.ToString();
                        newApp.SoftwareType = SoftwareTypes.CoreWebService;

                        appsTable.Upsert(newApp); //Uniquely identifies in apps

                        new AppFlows.Create(newApp.AppID, "Set app working folder.");

                        //Command.Exec("", "cd", new Dictionary<string, string> { { "", newApp.WorkingFolder } }, newApp.WorkingFolder, ref result);
                        //Create solution
                        Command.Exec("dotnet", "new sln", new Dictionary<string, string>
                        {
                            {"-o", newApp.WorkingFolder }

                        }, newApp.WorkingFolder, ref result);

                        new AppFlows.Create(newApp.AppID, "Created solution.");

                        //Create software
                        Command.Exec("dotnet", "new", new Dictionary<string, string> {
                                {"", "webapi" },
                                {"-o", "\"" + newApp.WorkingFolder + "\\" + newApp.AppName + "\"" },
                                {"-n", newApp.AppName }
                            }, newApp.WorkingFolder, ref result);

                        new AppFlows.Create(newApp.AppID, "Created app.");

                        //Add project to solution
                        Command.Exec("dotnet", "sln", new Dictionary<string, string>
                        {
                            {"add", newApp.AppName + "\\" + newApp.AppName + ".csproj" }

                        }, newApp.WorkingFolder, ref result);

                        new AppFlows.Create(newApp.AppID, "Added project to solution.");

                        //Create test project
                        Command.Exec("dotnet", "new", new Dictionary<string, string> {
                                {"", "xunit" },
                                {"-o", "\"" + newApp.WorkingFolder + "\\" + newApp.AppName + ".Tests" + "\"" },
                                {"-n", newApp.AppName + ".Tests" }
                            }, newApp.WorkingFolder, ref result);

                        new AppFlows.Create(newApp.AppID, "Created test app.");

                        //Add test app to solution
                        Command.Exec("dotnet", "sln", new Dictionary<string, string>
                        {
                            {"add", newApp.WorkingFolder + "\\" + newApp.AppName + ".Tests" + "\\" + newApp.AppName + ".Tests.csproj" }

                        }, newApp.WorkingFolder, ref result);

                        new AppFlows.Create(newApp.AppID, "Added test app to solution.");

                        //Add Brooksoft.Apps.Client nuget package
                        string projFileName = newApp.AppName + ".csproj";
                        string projFilePath = newApp.WorkingFolder + "\\" + newApp.AppName + "\\" + projFileName;

                        if (System.IO.File.Exists(projFilePath))
                        {
                            Command.Exec("dotnet", "add", new Dictionary<string, string>
                            {
                                {"", newApp.AppName + "\\" + projFileName },
                                {"package", "Brooksoft.Apps.Client"}

                            }, newApp.WorkingFolder, ref result);

                            new AppFlows.Create(newApp.AppID, "Added apps nuget package.");

                            newApp.ProjectFileFullName = projFilePath;
                            newApp.ProjectFileExists = true;
                            appsTable.Upsert(newApp);

                            //Add Load
                            string startupCSPath = newApp.WorkingFolder + "\\" + newApp.AppName + "\\Startup.cs";
                            string startupFile = System.IO.File.ReadAllText(startupCSPath);
                            string start = startupFile.Substring(0, startupFile.Length - 22);
                            string end = startupFile.Substring(startupFile.Length - 20);
                            string inserted = "var appsClient = new AppsClient.AppsClientConfig();appsClient.Load(\"Software14\", Environment.MachineName, Environment.CurrentDirectory, Environment.Version, new List<string>(), new List<AppsClient.AppsCustomConfigItem>(), true, true, new Flows.AppFlow());";
                            string changed = start + inserted + end;

                            new AppFlows.Create(newApp.AppID, "Added code to startup.");

                            //Parse
                            Microsoft.CodeAnalysis.SyntaxTree tree = Microsoft.CodeAnalysis.CSharp.CSharpSyntaxTree.ParseText(changed);
                            var diags = tree.GetDiagnostics().ToList();
                            foreach (var diag in diags)
                            {
                                result.FailMessages.Add("(Start: " + diag.Location.SourceSpan.Start.ToString() + ", End: " + diag.Location.SourceSpan.End.ToString() + ") " + diag.Severity.ToString() + " " + diag.Descriptor.Id.ToString() + " " + diag.Descriptor.MessageFormat); ;
                            }
                            if (result.FailMessages.Count == 0)
                            {
                                System.IO.File.WriteAllText(startupCSPath, changed);
                                result.SuccessMessages.Add("CS file updated.");

                                new AppFlows.Create(newApp.AppID, "Written and parsed successfully!");
                            }
                            else
                                result.FailMessages.Add("CS file did not update.");


                            //Run
                            Command.Exec("dotnet", "run", new Dictionary<string, string>
                            {
                                {"", newApp.WorkingFolder + "\\" + newApp.AppName + "\\" + projFileName }

                            }, newApp.WorkingFolder, ref result);

                            new AppFlows.Create(newApp.AppID, "Started app.");
            
                            result.Success = true;
                        }
                        else
                            new AppFlows.Create.Fail("Project file not found for add package: " + projFilePath, ref result);
                    }
                    else
                        new AppFlows.Create.Fail("No software type found to create.", ref result);
                }
                else
                    new AppFlows.Create.Fail("Apps folders folder not found.", ref result);
            }
            catch (System.Exception ex)
            {
                new AppFlows.Create.Exception(ex, ref result);
            }

            return result;
        }

    }
}

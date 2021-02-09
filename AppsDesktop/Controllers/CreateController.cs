using AppsClient;
using AppsClient.Docs;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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

                //appsTable.Upsert(newApp);
                //softwaresTable.Upsert(newSoftware);

                string appFoldersFolder = System.Environment.CurrentDirectory + "\\AppFolders";
                if (System.IO.Directory.Exists(appFoldersFolder))
                {
                    System.IO.Directory.CreateDirectory(appFoldersFolder + "\\App" + newApp.AppID.ToString());
                    System.IO.Directory.CreateDirectory(appFoldersFolder + "\\App" + newApp.AppID.ToString() + "\\Software");
                    System.IO.Directory.CreateDirectory(appFoldersFolder + "\\App" + newApp.AppID.ToString() + "\\Software\\Software" + newSoftware.SoftwareID.ToString());

                    result.SuccessMessages.Add("Created all folders.");

                    if (softwareType == SoftwareTypes.CoreWebService)
                    {
                        //Create software
                        Command.Exec("dotnet", "new", new Dictionary<string, string> {
                                {"", "webapi" },
                                {"-o", "\"" + newApp.WorkingFolder + "\"" }
                            }, ref result);

                        //TODO: check if failed

                        ////Add Brooksoft.Apps.Client nuget package
                        //Command.Exec("dotnet", "add", new Dictionary<string, string>
                        //{
                        //    {"", newApp.WorkingFolder + "\\Software" + newSoftware.SoftwareID.ToString() + ".csproj" },
                        //    {"package", "Brooksoft.Apps.Client" }
                        //}, ref result);

                    }
                    else
                        result.FailMessages.Add("No software type found to create.");

                    newApp.WorkingFolder = appFoldersFolder + "\\App" + newApp.AppID.ToString() + "\\Software\\Software" + newSoftware.SoftwareID.ToString();

                    result.SuccessMessages.Add("Set app working folder.");


                }
                else
                    result.FailMessages.Add("Apps folders folder not found.");
            }
            catch (System.Exception ex)
            {
                new AppFlows.Create.Exception(ex, ref result);
            }

            result.Success = true;
            return result;
        }

    }
}

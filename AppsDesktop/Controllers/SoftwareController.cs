using AppsClient;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace AppsDesktop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SoftwareController : ControllerBase
    {
        private static string dbPath = Environment.CurrentDirectory + "\\Software.db";

        private IWebHostEnvironment _env;

        public SoftwareController(IWebHostEnvironment env)
        {
            _env = env;
        }

        //[HttpGet]
        //[Route("GetSoftwareModel")]
        //public AppsResult GetSoftwareModel()
        //{
        //    return new AppsResult() { Data = new Software(), Success = true };
        //}

        //[HttpGet]
        //[Route("GetSoftwares")]
        //public AppsResult GetSoftwares()
        //{
        //    var result = new AppsResult();

        //    try
        //    {
        //        using (var db = new LiteDatabase(dbPath))
        //        {
        //            var softwares = db.GetCollection<Software>("Softwares"); // db.Softwares.Add(software);

        //            result.Data = softwares.FindAll().ToList();
        //            result.Success = true;
        //        }

        //    }
        //    catch (System.Exception ex)
        //    {
        //        // new Flows.AppsSystem.Initialize.AppUpdated..Exception( AppsLog.LogStep<Flows.Initialize.Exception>(ex.ToString());
        //        // new Flows.Apps.
        //        new Flows.Plan.Apps.Exception(ex, ref result);
        //    }

        //    return result;
        //}
        //[HttpPost]
        //[Route("UpsertSoftware")]
        //public AppsResult UpsertSoftware([FromBody] Software software)
        //{
        //    var result = new AppsResult();

        //    try
        //    {
        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {

        //            var objs = dblocal.GetCollection<Software>("Softwares");
        //            objs.Upsert(software);

        //            result.Data = objs.FindAll().ToList();
        //            result.Success = true;
        //        }

        //    }
        //    catch (System.Exception ex)
        //    {
        //        new Flows.Plan.Apps.Exception(ex, ref result);
        //    }

        //    return result;
        //}


    }
}

using AppsClient;
using Brooksoft.Apps.Client.Docs;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppComponentController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;

        public AppComponentController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
        }
        [HttpGet]
        [Route("GetAppComponentModel")]
        public AppsResult GetAppComponentModel()
        {
            return new AppsResult() { Data = new AppComponent(), Success = true };
        }
        [HttpGet]
        [Route("GetAppComponents")]
        public AppsResult GetAppComponents(int appId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<AppComponent>("AppComponents"); // db.Softwares.Add(software);

                result.Data = objs.Query().Where(ss => ss.AppID == appId && ss.Archived == false).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.AppComponents.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("GetAppComponent")]
        public AppsResult GetAppComponent(int appComponentId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<AppComponent>("AppComponents");

                result.Data = objs.Query().Where(ss => ss.ID == appComponentId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.AppComponents.Exception(ex, ref result);
            }

            return result;
        }
        [HttpPost]
        [Route("UpsertAppComponent")]
        public AppsResult UpsertAppComponent([FromBody] AppComponent appComponent)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<AppComponent>("AppComponents");
                objs.Upsert(appComponent);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.AppComponents.Exception(ex, ref result);
            }

            return result;
        }

    }
}
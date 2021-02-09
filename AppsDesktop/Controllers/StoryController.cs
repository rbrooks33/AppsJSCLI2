using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoryController : ControllerBase
    {
        private static string dbPath = Environment.CurrentDirectory + "\\Apps.db";

        private IWebHostEnvironment _env;

        public StoryController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet]
        [Route("GetStoryModel")]
        public AppsClient.AppsResult GetStoryModel()
        {
            return new AppsClient.AppsResult() { Data = new SoftwareStory(), Success = true };
        }

        [HttpGet]
        [Route("GetStories")]
        public AppsClient.AppsResult GetStories()
        {
            var result = new AppsClient.AppsResult();

            try
            {
                using (var db = new LiteDatabase(dbPath))
                {
                    var objs = db.GetCollection<SoftwareStory>("Stories");

                    result.Data = objs.FindAll().ToList();
                    result.Success = true;
                }

            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Stories.Exception(ex, ref result);
            }

            return result;
        }
        [HttpPost]
        [Route("UpsertStory")]
        public AppsClient.AppsResult UpsertStory([FromBody] SoftwareStory story)
        {
            var result = new AppsClient.AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {

                    var objs = dblocal.GetCollection<SoftwareStory>("Stories");
                    objs.Upsert(story);

                    result.Data = objs.FindAll().ToList();
                    result.Success = true;
                }

            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Stories.Exception(ex, ref result);
            }

            return result;
        }


    }
}

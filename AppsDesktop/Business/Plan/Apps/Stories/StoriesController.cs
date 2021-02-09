using AppsClient;
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
    public class SoftwareStoriesController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;

        public SoftwareStoriesController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
        }
        [HttpGet]
        [Route("GetSoftwareStoryModel")]
        public AppsResult GetSoftwareStoryModel()
        {
            return new AppsResult() { Data = new SoftwareStory(), Success = true };
        }
        [HttpGet]
        [Route("GetSoftwareStories")]
        public AppsResult GetSoftwareStories(int appId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<SoftwareStory>("SoftwareStories"); // db.Softwares.Add(software);

                result.Data = objs.Query().Where(ss => ss.AppID == appId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Stories.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("GetSoftwareStory")]
        public AppsResult GetSoftwareStory(int softwareStoryId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<SoftwareStory>("SoftwareStories");

                result.Data = objs.Query().Where(ss => ss.StoryID == softwareStoryId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Stories.Exception(ex, ref result);
            }

            return result;
        }
        [HttpPost]
        [Route("UpsertSoftwareStory")]
        public AppsResult UpsertSoftwareStory([FromBody] SoftwareStory softwareStory)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<SoftwareStory>("SoftwareStories");
                objs.Upsert(softwareStory);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Stories.Exception(ex, ref result);
            }

            return result;
        }

    }
}

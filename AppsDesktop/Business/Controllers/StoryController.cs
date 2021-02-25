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
    public class StoryController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;

        public StoryController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
        }
        [HttpGet]
        [Route("GetStoryModel")]
        public AppsResult GetStoryModel()
        {
            return new AppsResult() { Data = new Story(), Success = true };
        }
        [HttpGet]
        [Route("GetStories")]
        public AppsResult GetStories(int appId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Story>("Stories"); // db.Softwares.Add(software);

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
        [Route("GetStory")]
        public AppsResult GetStory(int storyId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Story>("Stories");

                result.Data = objs.Query().Where(ss => ss.ID == storyId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.Stories.Exception(ex, ref result);
            }

            return result;
        }
        [HttpPost]
        [Route("UpsertStory")]
        public AppsResult UpsertStory([FromBody] Story story)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Story>("Stories");
                objs.Upsert(story);

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
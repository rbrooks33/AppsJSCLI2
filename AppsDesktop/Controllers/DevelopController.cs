﻿using AppsClient;
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
    public class DevelopController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;
        private AppsData _data;

        public DevelopController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
            _data = data;
        }

        [HttpGet]
        [Route("GetFileModel")]
        public AppsResult GetFileModel()
        {
            var result = new AppsResult();
            result.Data = new SoftwareFile();
            result.Success = true;
            return result;
        }

        [HttpGet]
        [Route("GetFileCodeModel")]
        public AppsResult GetFileCodeModel()
        {
            var result = new AppsResult();
            result.Data = new SoftwareFileCode();
            result.Success = true;
            return result;
        }
        [HttpGet]
        [Route("GetFiles")]
        public AppsResult GetFiles(int appId)
        {
            var result = new AppsResult();

            try
            {
                var files = _db.GetCollection<SoftwareFile>("SoftwareFiles");
                var codes = _db.GetCollection<SoftwareFileCode>("SoftwareFileCodes");

                var fileList = files.Query().Where(f => f.AppID == appId).ToList();
             
                foreach(var file in fileList)
                {
                    var fileCodes = codes.Query().Where(c => c.SoftwareFileID == file.SoftwareFileID);
                    if (fileCodes.Count() > 0)
                        file.SoftwareFileCodes.AddRange(fileCodes.ToList());
                }
                result.Success = true;
            }
            catch(System.Exception ex)
            {
                new AppFlows.Develop.Exception(ex, ref result);
            }
            return result;
        }
        [HttpPost]
        [Route("")]
        public AppsResult UpsertTestPlan([FromBody] TestPlan testPlan)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<TestPlan>("TestPlans");
                objs.Upsert(testPlan);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }

            return result;
        }

        //TESTS

        [HttpGet]
        [Route("GetTestModel")]
        public AppsResult GetTestModel()
        {
            var result = new AppsResult();
            result.Data = new Test();
            result.Success = true;
            return result;
        }

        [HttpGet]
        [Route("GetTests")]
        public AppsResult GetTests(int testPlanId)
        {
            var result = new AppsResult();

            try
            {
                if (testPlanId > 0)
                {
                    var tests = _db.GetCollection<Test>("Tests");

                    var appTests = tests.Query().Where(tp => tp.TestPlanID == testPlanId && tp.Archived == false).ToList();

                    result.Data = appTests;
                    result.Success = true;
                }
                else
                    result.FailMessages.Add("Test plan ID is zero.");
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }
            return result;
        }
        [HttpPost]
        [Route("UpsertTest")]
        public AppsResult UpsertTest([FromBody] Test test)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Test>("Tests");
                objs.Upsert(test);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }

            return result;
        }

        //STEPS

        [HttpGet]
        [Route("GetStepModel")]
        public AppsResult GetStepModel()
        {
            var result = new AppsResult();
            result.Data = new TestStep();
            result.Success = true;
            return result;
        }

        [HttpGet]
        [Route("GetSteps")]
        public AppsResult GetSteps(int testId)
        {
            var result = new AppsResult();

            try
            {
                if (testId > 0)
                {
                    var steps = _db.GetCollection<TestStep>("Steps");

                    var appSteps = steps.Query().Where(s => s.TestID == testId && s.Archived == false).ToList();

                    result.Data = appSteps;
                    result.Success = true;
                }
                else
                    result.FailMessages.Add("Test ID is zero.");
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }
            return result;
        }
        [HttpPost]
        [Route("UpsertStep")]
        public AppsResult UpsertStep([FromBody] TestStep step)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<TestStep>("Steps");
                objs.Upsert(step);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("Run")]
        public AppsResult Run(int appId)
        {
            var result = new AppsResult();

            try
            {
                var apps = new AppsController(_env, _data);
                var appResult = apps.GetApp(appId);

                if (appResult.Success)
                {
                    var appList = (List<App>)appResult.Data;
                    var app = appList.Single();
                    string cmdPath = System.IO.Path.Combine(Environment.SystemDirectory, "cmd.exe");

                    Command.Exec("explorer", "https://localhost:5001/swagger/index.html", new Dictionary<string, string>() {
                    }, app.WorkingFolder, ref result  );


                    ////Run
                    //Command.Exec("dotnet", "run", new Dictionary<string, string>
                    //        {
                    //            {"", app.AppName + ".csproj" },
                    //            {"--urls", "https://localhost:50000" }

                    //        }, app.WorkingFolder, ref result);

                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }
            return result;
        }

    }
}
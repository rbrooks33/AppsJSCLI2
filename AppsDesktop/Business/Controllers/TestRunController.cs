using AppsClient;
using AppsDesktop.Controllers;
using Brooksoft.Apps.Client.Tests;
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
    public class TestRunController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;
        private AppsData _data;
        private OpenQA.Selenium.Chrome.ChromeDriver _driver; // = new OpenQA.Selenium.Chrome.ChromeDriver(Environment.CurrentDirectory + "\\Libraries");

        public TestRunController(IWebHostEnvironment env, AppsData data, OpenQA.Selenium.Chrome.ChromeDriver driver)
        {
            _env = env;
            _db = data.AppsDB;
            _data = data;
            _driver = driver;
        }
        [HttpGet]
        [Route("GetTestRunModel")]
        public AppsResult GetTestRunModel()
        {
            return new AppsResult() { Data = new TestRun(), Success = true };
        }
        [HttpGet]
        [Route("GetTestRuns")]
        public AppsResult GetTestRuns(int testRunInstanceId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<TestRun>("TestRuns"); // db.Softwares.Add(software);

                result.Data = objs.Query().Where(ss => ss.TestRunInstanceID == testRunInstanceId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.TestRun.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("GetTestRun")]
        public AppsResult GetTestRun(int testRunId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<TestRun>("TestRuns");

                result.Data = objs.Query().Where(ss => ss.TestRunID == testRunId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.TestRun.Exception(ex, ref result);
            }

            return result;
        }
        [HttpPost]
        [Route("UpsertTestRun")]
        public AppsResult UpsertTestRun([FromBody] TestRun testRun)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<TestRun>("TestRuns");
                objs.Upsert(testRun);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.TestRun.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("RunFunctional")]
        public AppsResult RunFunctional(int appId, TestRunInstanceType type, int uniqueId)
        {
            var result = new AppsResult();

            try
            {
                var triList = _db.GetCollection<TestRunInstance>("TestRunInstances"); //plan, test or step
                var trList = _db.GetCollection<TestRun>("TestRuns"); //each step
                var testList = _db.GetCollection<Test>("Tests"); //each step


                var tri = new TestRunInstance();

                tri.Type = type;
                tri.UniqueID = uniqueId;

                triList.Upsert(tri);

                var testController = new TestController(_env, _data, _driver);

                switch (type)
                {
                    case TestRunInstanceType.TestPlan:

                        var testPlans = (List<TestPlan>)testController.GetTestPlans(appId).Data;
                        var testPlan = testPlans.Where(tp => tp.ID == uniqueId);
                        var tests = (List<Test>)testController.GetTests(testPlan.Single().ID).Data;

                        foreach (var testPlanTest in tests)
                        {
                            var steps = (List<TestStep>)testController.GetSteps(testPlanTest.ID).Data;
                            foreach (var step in steps)
                            {
                                testController.RunStepScript(tri.ID, uniqueId, testPlanTest.ID, step.ID, step.Script);
                            }
                        }
                        break;

                    case TestRunInstanceType.Test:

                        var test = (List<Test>)testController.GetTest(uniqueId).Data;
                        
                        var testSteps = (List<TestStep>)testController.GetSteps(test.Single().ID).Data;
                        foreach (var step in testSteps)
                        {
                            testController.RunStepScript(tri.ID, test.Single().TestPlanID, test.Single().ID, step.ID, step.Script);
                        }

                        break;
                    case TestRunInstanceType.TestStep:

                        var testSteps2 = (List<TestStep>)testController.GetStep(uniqueId).Data;
                        if (testSteps2.Count == 1)
                        {
                            var testStep = testSteps2.Single();
                            var stepTestList = testList.Query().Where(t => t.ID == testStep.TestID).ToList();
                            if (stepTestList.Count() == 1)
                            {
                                var stepTest = stepTestList.Single();
                                testController.RunStepScript(tri.ID, stepTest.TestPlanID, testStep.TestID, testStep.ID, testStep.Script);
                            }
                            else
                                new AppFlows.Test.TestRun.Fail("None or more than on test step found.", ref result);
                        }
                        else
                            new AppFlows.Test.TestRun.Fail("None or more than one step found.", ref result);

                        break;
                }
                //result.Data = objs.Query().Where(ss => ss.ID == testRunId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.TestRun.Exception(ex, ref result);
            }

            return result;
        }
        public class TestResult
        {
            public TestRunInstance Instance;
            public List<TestRun> Runs;
        }
        [HttpGet]
        [Route("GetLatestResults")]
        public AppsResult GetLatestResults(TestRunInstanceType type, int uniqueId)
        {
            var result = new AppsResult();

            try
            {
                var triList = _db.GetCollection<TestRunInstance>("TestRunInstances"); //plan, test or step
                var trList = _db.GetCollection<TestRun>("TestRuns"); //each step

                var tri = triList.Query()
                    .Where(tri => tri.Type == type && tri.UniqueID == uniqueId)
                    .OrderByDescending(tri => tri.DateCreated);

                if (tri.Count() > 0)
                {
                    var triSingle = tri.First();

                    var runResult = new TestResult();
                    runResult.Instance = triSingle;
                    runResult.Runs = trList.Query().Where(tr => tr.TestRunInstanceID == triSingle.ID).ToList();

                    result.Data = runResult;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.TestRun.Exception(ex, ref result);
            }

            return result;
        }

    }
}
using AppsClient;
using Brooksoft.Apps.Client.Tests;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OpenQA.Selenium.Interactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;
        private AppsData _data;
        private AppsContext _ctx;
        private OpenQA.Selenium.Chrome.ChromeDriver _driver; // = new OpenQA.Selenium.Chrome.ChromeDriver(Environment.CurrentDirectory + "\\Libraries");

        public TestController(IWebHostEnvironment env, AppsData data, OpenQA.Selenium.Chrome.ChromeDriver driver, AppsContext ctx)
        {
            _env = env;
            _db = data.AppsDB;
            _data = data;
            _driver = driver;
            _ctx = ctx;
        }

        [HttpGet]
        [Route("GetTestPlanModel")]
        public AppsResult GetTestPlanModel()
        {
            var result = new AppsResult();
            result.Data = new TestPlan();
            result.Success = true;
            return result;
        }
        
        [HttpGet]
        [Route("GetTestPlans")]
        public AppsResult GetTestPlans(int appId)
        {
            var result = new AppsResult();

            try
            {
                var testRunController = new TestRunController(_env, _data, _driver, _ctx);
                var testplans = _db.GetCollection<TestPlan>("TestPlans");
                var tests = _db.GetCollection<Test>("Tests");
                var teststeps = _db.GetCollection<TestStep>("TestSteps");

                var appTestPlans = testplans.Query().Where(tp => tp.AppID == appId && tp.Archived == false).ToList();

                foreach (var appTestPlan in appTestPlans)
                {
                    var testResults = testRunController.GetLatestResults(TestRunInstanceType.TestPlan, appTestPlan.ID).Data;
                    appTestPlan.Results = Newtonsoft.Json.JsonConvert.SerializeObject(testResults);
                    //var planTests = tests.Query().Where(t => t.TestPlanID == appTestPlan.ID).ToList();

                    //if (planTests.Count() > 0)
                    //{
                    //    appTestPlan.Tests.AddRange(planTests);

                    //    foreach (var planTest in planTests)
                    //    {
                    //        var testSteps = teststeps.Query().Where(ts => ts.TestID == planTest.TestID).ToList();
                    //        if (testSteps.Count() > 0)
                    //        {
                    //            planTest.Steps.AddRange(testSteps);
                    //        }
                    //    }
                    //}
                }

                result.Data = appTestPlans;
                result.Success = true;
            }
            catch(System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }
            return result;
        }
        [HttpGet]
        [Route("GetTestPlan")]
        public AppsResult GetTestPlan(int testPlanId)
        {
            var result = new AppsResult();
            var testRunController = new TestRunController(_env, _data, _driver, _ctx);

            try
            {
                var testplans = _db.GetCollection<TestPlan>("TestPlans").Query().Where(tp => tp.ID == testPlanId);
                if (testplans.Count() == 1)
                {
                    var testPlan = testplans.Single();
                    var testResults = testRunController.GetLatestResults(TestRunInstanceType.TestPlan, testPlan.ID).Data;
                    testPlan.Results = Newtonsoft.Json.JsonConvert.SerializeObject(testResults);

                    result.Data = testPlan;
                    result.Success = true;
                }
                else
                    new AppFlows.Test.Fail("Returned either zero or more than one test plans.", ref result);

            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }
            return result;
        }
        [HttpPost]
        [Route("UpsertTestPlan")]
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
            var testRunController = new TestRunController(_env, _data, _driver, _ctx);

            try
            {
                if (testPlanId > 0)
                {
                    var tests = _db.GetCollection<Test>("Tests");
                    var steps = _db.GetCollection<TestStep>("Steps");

                    var appTests = tests.Query().Where(tp => tp.TestPlanID == testPlanId && tp.Archived == false).ToList();
                    foreach(var test in appTests)
                    {
                        //var testSteps = steps.Query().Where(ts => ts.TestID == test.ID && ts.Archived == false).ToList();
                        //if (testSteps.Count() > 0)
                        //    test.Steps.AddRange(testSteps);

                        //TODO: Refactor to somehow handle getting results produced by clicking "Test" as well as "TestPlan" test runs
                        var testResults = testRunController.GetLatestResults(TestRunInstanceType.TestPlan, testPlanId).Data;
                        test.Results = Newtonsoft.Json.JsonConvert.SerializeObject(testResults);

                    }
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
        [HttpGet]
        [Route("GetTest")]
        public AppsResult GetTest(int testId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<Test>("Tests");

                result.Data = objs.Query().Where(ss => ss.ID == testId).ToList();
                result.Success = true;
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
                    var testRunController = new TestRunController(_env, _data, _driver, _ctx);
                    var steps = _db.GetCollection<TestStep>("Steps");

                    var appSteps = steps.Query().Where(s => s.TestID == testId && s.Archived == false).ToList();
                    var test = (List<Test>)GetTest(testId).Data; //TODO: Refactor safer

                    foreach (var step in appSteps)
                    {
                        //TODO: Decide how to choose between result from test plan or individual step test runs
                        var testResults = testRunController.GetLatestResults(TestRunInstanceType.TestPlan, test.Single().TestPlanID).Data;
                        step.Results = Newtonsoft.Json.JsonConvert.SerializeObject(testResults);
                    }

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
        [HttpGet]
        [Route("GetStep")]
        public AppsResult GetStep(int testStepId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<TestStep>("Steps");

                result.Data = objs.Query().Where(ss => ss.ID == testStepId).ToList();
                result.Success = true;
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
                result.Data = step;
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }

            return result;
        }
        public class TestRunResult
        {
            public bool TestsPassed { get; set; }
            public int Passed { get; set; }
            public int Failed { get; set; }
            public int Skipped { get; set; }
            public int Total { get; set; }
            public string DurationData { get; set; }
            public string Info { get; set; }
        }
        [HttpGet]
        [Route("RunUnits")]
        public AppsResult RunUnits(int appId)
        {
            var result = new AppsResult();

            try
            {
                var apps = new AppsController(_env, _data, _ctx);
                var appResult = apps.GetApp(appId);

                if (appResult.Success)
                {
                    var appList = (List<App>)appResult.Data;
                    var app = appList.Single();

                    var objs = _db.GetCollection<PublishProfile>("PublishProfiles");
                    var ppList = objs.Query().Where(pp => pp.AppID == app.AppID);
                    if (ppList.Count() > 0)
                    {
                        var pp = ppList.First();
                        var fiTestFile = new System.IO.FileInfo(pp.TestProjectFilePath);
                        if (fiTestFile.Exists)
                        {
                            string testFolder = fiTestFile.DirectoryName;
                            Command.Exec("dotnet", "test", new Dictionary<string, string>() { { "", pp.TestProjectFilePath } }, testFolder, ref result);

                            int lineIndex = 0;
                            foreach (string line in result.SuccessMessages)
                            {
                                if (line.Contains("test files matched the specified pattern"))
                                {
                                    //Next line has the test data
                                    if (result.SuccessMessages.Count >= lineIndex + 2) //Make sure there is a next line for sanity
                                    {
                                        string testInfo = result.SuccessMessages[lineIndex + 1];
                                        if (testInfo.Contains("Passed") && testInfo.Contains("Failed")) //Again, check if really is
                                        {
                                            var testRunResult = new TestRunResult();
                                            string[] testResults = testInfo.Split('-');
                                            if (testResults.Count() == 3)
                                            {
                                                testRunResult.TestsPassed = testResults[0].ToLower().Contains("passed");
                                                testRunResult.Info = testResults[2];

                                                string[] testData = testResults[1].Split(',');
                                                int failedCount = 0;
                                                int passedCount = 0;
                                                int skippedCount = 0;
                                                int totalCount = 0;

                                                //[0]: "Passed!  - Failed:     0"
                                                //[1]: " Passed:     1"
                                                //[2]: " Skipped:     0"
                                                //[3]: " Total:     1"
                                                //[4]: " Duration: 9 ms - Brooksoft.Apps.Test.dll (net5.0)"

                                                if (testData.Length == 5)
                                                {
                                                    testRunResult.DurationData = testData[4];

                                                    bool testDataHasColons = true;

                                                    foreach (string testDatum in testData)
                                                    {
                                                        if (!testDatum.Contains(":"))
                                                        {
                                                            testDataHasColons = false; break;
                                                        }
                                                    }

                                                    if (testDataHasColons)
                                                    {
                                                        if (int.TryParse(testData[0].Split(':')[1], out failedCount)
                                                            && int.TryParse(testData[1].Split(':')[1], out passedCount)
                                                            && int.TryParse(testData[2].Split(':')[1], out skippedCount)
                                                            && int.TryParse(testData[3].Split(':')[1], out totalCount))
                                                        {
                                                            testRunResult.Failed = failedCount;
                                                            testRunResult.Passed = passedCount;
                                                            testRunResult.Skipped = skippedCount;
                                                            testRunResult.Total = totalCount;

                                                            result.Data = testRunResult;
                                                            result.Success = true;
                                                        }
                                                        else
                                                            new AppFlows.Test.Fail("Inner test count data not formatted as expected.", ref result);
                                                    }
                                                    else
                                                        new AppFlows.Test.Fail("Test counts not formatted as expected.", ref result);
                                                }
                                                else
                                                    new AppFlows.Test.Fail("Inner test data does not have 5 items.", ref result);
                                            }
                                            else
                                                new AppFlows.Test.Fail("Inner test data is not 3 lines.", ref result);
                                        }
                                        else
                                            new AppFlows.Test.Fail("Do not see test data key words.", ref result);
                                    }
                                    else
                                        new AppFlows.Test.Fail("No test data after identifying line.", ref result);
                                }
                                //else
                                //    new AppFlows.Test.Fail("Success messages do not contain sentence identifying tests results exist.", ref result);

                                lineIndex++;
                            }
                        }
                        else
                            new AppFlows.Test.Fail("Publish profile does not have a valid test project path.", ref result);
                    }
                    else
                        new AppFlows.Test.Fail("No publish profiles for test.", ref result);
                    //string cmdPath = System.IO.Path.Combine(Environment.SystemDirectory, "cmd.exe");

                    //Command.Exec("explorer", "https://localhost:5001/swagger/index.html", new Dictionary<string, string>() {
                    //}, app.WorkingFolder, ref result  );


                    ////Run
                    //Command.Exec("dotnet", "run", new Dictionary<string, string>
                    //        {
                    //            {"", app.AppName + ".csproj" },
                    //            {"--urls", "https://localhost:50000" }

                    //        }, app.WorkingFolder, ref result);

                }
                else
                    new AppFlows.Test.Fail("Failed getting app.", ref result);
            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
            }
            return result;
        }
        [HttpGet]
        [Route("RunStepScript")]
        public AppsResult RunStepScript(int testRunInstanceId, int testPlanId, int testId, int stepId, string script)
        {
            var result = new AppsResult();
            var trList = (LiteCollection<TestRun>)_db.GetCollection<TestRun>("TestRuns");
            var trl = new TestResult(trList, testRunInstanceId, testPlanId, testId, stepId);
            
            try
            {
                //var hub = new AppsHub(_data);
                //hub.Load();
                AppsClientConfig.AppsURL = "https://localhost:54321";
                AppsClientHub.Load();

                
                var doc = new System.Xml.XmlDocument();
                doc.LoadXml("<temproot>" + script + "</temproot>");

                result.Success = true; //"one false move" mode


                foreach(System.Xml.XmlNode node in doc.DocumentElement.ChildNodes)
                {
                    if(node.Name == "OpenSite")
                    {
                        string url = node.Attributes["Link"].Value;
                        _driver.Navigate().GoToUrl(url);

                        var wait = new OpenQA.Selenium.Support.UI.WebDriverWait(_driver, TimeSpan.FromSeconds(5));
                        wait.Until(p => p.FindElement(OpenQA.Selenium.By.XPath("/html/body/div[1]/img")).Displayed);

                        AppsClientHub.TestProgress(TestMessageStatus.Info, "Navigated to " + url);

                        trl.Note("Navigated to " + url);
                    }
                    else if(node.Name == "FindButton")
                    {
                        if (node.Attributes["ByXPath"] != null)
                        {
                            string nodeValue = node.Attributes["ByXPath"].Value;
                            var element = _driver.FindElementByXPath(nodeValue);
                            element.Click();

                            AppsClientHub.TestProgress(TestMessageStatus.Info, "Found button by xpath " + nodeValue + "  and clicked.");
                            trl.Note("Found button by xpath " + nodeValue + "  and clicked.");

                            if (node.Attributes["Mouse"] != null)
                            {
                                if (node.Attributes["Mouse"].Value == "move")
                                {
                                    var action = new Actions(_driver);
                                    action.MoveToElement(element);
                                    AppsClientHub.TestProgress(TestMessageStatus.Info, "Moved mouse to element.");
                                    trl.Note("Moved mouse to element.");
                                }
                            }
                        }
                        else if(node.Attributes["ByID"] != null)
                        {
                            string nodeValue = node.Attributes["ByID"].Value;
                            var element = _driver.FindElementById(nodeValue);
                            element.Click();
                            trl.Note("Found element by id: " + nodeValue.ToString());
                        }
                        else
                        {
                            AppsClientHub.TestProgress(TestMessageStatus.Warning, "No attrib. match found for FindButton.");
                            trl.Note("No attrib. match found for FindButton.", false);
                            result.Success = false;
                            break;
                        }
                            
                    }
                    else if(node.Name == "Delay")
                    {

                        int milliseconds = 5000;
                        if (node.Attributes["Milliseconds"] != null)
                            int.TryParse(node.Attributes["Milliseconds"].Value.ToString(), out milliseconds);

                        AppsClientHub.TestProgress(TestMessageStatus.Info, "Delaying " + (milliseconds / 1000).ToString() + " seconds.");
                        trl.Note("Delaying " + (milliseconds / 1000).ToString() + " seconds.");

                        System.Threading.Thread.Sleep(milliseconds);
                    }
                }


            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
                result.FailMessages.Add("Exception: " + ex.Message);

                result.Success = false;
                trl.Note("Exception: " + System.Web.HttpUtility.HtmlEncode(ex.Message), false);
            }

            trl.Result(result.Success);

            result.Data = trl;

            return result;
        }
        public class TestResult
        {
            private LiteCollection<TestRun> TestRunTable;
            private int TestPlanID;
            private int TestID;
            private int StepID;
            private int TestRunInstanceID;
            public TestResult(LiteCollection<TestRun> testRunTable, int testRunInstanceId, int testPlanId, int testId, int stepId)
            {
                this.TestRunTable = testRunTable;
                this.TestRunInstanceID = testRunInstanceId;
                this.TestPlanID = testPlanId;
                this.TestID = testId;
                this.StepID = stepId;
            }
            public void Note(string description, bool passed = true)
            {
                var run = new TestRun();
                run.TestRunInstanceID = this.TestRunInstanceID;
                run.TestStepID = this.StepID;
                run.TestID = this.TestID;
                run.TestPlanID = this.TestPlanID;
                run.IsNote = true;
                run.Description = description;
                run.Passed = passed;
                this.TestRunTable.Insert(run);
            }
            public void Result(bool passed, string description = "")
            {
                var run = new TestRun();
                run.TestRunInstanceID = this.TestRunInstanceID;
                run.TestStepID = this.StepID;
                run.TestID = this.TestID;
                run.TestPlanID = this.TestPlanID;
                run.IsNote = false;
                if(passed)
                {
                    run.DatePassed = DateTime.Now;
                    run.Description = "Test #" + this.TestID.ToString() + " Step #" + this.StepID.ToString() + " passed." + description;
                    run.Passed = true;
                }
                else
                {
                    run.DateFailed = DateTime.Now;
                    run.Description = "Test #" + this.TestID.ToString() + " Step #" + this.StepID.ToString() + " failed." + description;
                    run.Passed = false;
                }
                this.TestRunTable.Insert(run);
            }
        }
    }
}
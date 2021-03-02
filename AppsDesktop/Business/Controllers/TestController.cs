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

        public TestController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
            _data = data;
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
                var testplans = _db.GetCollection<TestPlan>("TestPlans");
                var tests = _db.GetCollection<Test>("Tests");
                var teststeps = _db.GetCollection<TestStep>("TestSteps");

                var appTestPlans = testplans.Query().Where(tp => tp.AppID == appId && tp.Archived == false).ToList();

                foreach (var appTestPlan in appTestPlans)
                {
                    var planTests = tests.Query().Where(t => t.TestPlanID == appTestPlan.ID).ToList();

                    if (planTests.Count() > 0)
                    {
                        appTestPlan.Tests.AddRange(planTests);

                        foreach (var planTest in planTests)
                        {
                            var testSteps = teststeps.Query().Where(ts => ts.TestID == planTest.TestID).ToList();
                            if (testSteps.Count() > 0)
                            {
                                planTest.Steps.AddRange(testSteps);
                            }
                        }
                    }
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
        public AppsResult RunStepScript(string script)
        {
            var result = new AppsResult();
            
            try
            {
                //var hub = new AppsHub(_data);
                //hub.Load();
                AppsClientConfig.AppsURL = "https://localhost:54321";
                AppsClientHub.Load();

                var driver = new OpenQA.Selenium.Chrome.ChromeDriver(Environment.CurrentDirectory + "\\Libraries");
                
                var doc = new System.Xml.XmlDocument();
                doc.LoadXml("<temproot>" + script + "</temproot>");
                
                
                foreach(System.Xml.XmlNode node in doc.DocumentElement.ChildNodes)
                {
                    if(node.Name == "OpenSite")
                    {
                        string url = node.Attributes["Link"].Value;
                        driver.Navigate().GoToUrl(url);

                        var wait = new OpenQA.Selenium.Support.UI.WebDriverWait(driver, TimeSpan.FromSeconds(5));
                        wait.Until(p => p.FindElement(OpenQA.Selenium.By.XPath("/html/body/div[1]/img")).Displayed);

                        AppsClientHub.TestProgress(TestMessageStatus.Info, "Navigated to " + url);
                    }
                    else if(node.Name == "FindButton")
                    {
                        if (node.Attributes["ByXPath"] != null)
                        {
                            string nodeValue = node.Attributes["ByXPath"].Value;
                            var element = driver.FindElementByXPath(nodeValue);
                            element.Click();

                            AppsClientHub.TestProgress(TestMessageStatus.Info, "Found button by xpath " + nodeValue + "  and clicked.");

                            if (node.Attributes["Mouse"] != null)
                            {
                                if (node.Attributes["Mouse"].Value == "move")
                                {
                                    var action = new Actions(driver);
                                    action.MoveToElement(element);
                                    AppsClientHub.TestProgress(TestMessageStatus.Info, "Moved mouse to element.");
                                }
                            }
                        }
                        else
                        {
                            AppsClientHub.TestProgress(TestMessageStatus.Warning, "No attrib. match found for FindButton.");
                        }
                            
                    }
                    else if(node.Name == "Delay")
                    {

                        int milliseconds = 5000;
                        if (node.Attributes["Milliseconds"] != null)
                            int.TryParse(node.Attributes["Milliseconds"].ToString(), out milliseconds);

                        AppsClientHub.TestProgress(TestMessageStatus.Info, "Delaying " + (milliseconds / 1000).ToString() + " seconds.");

                        System.Threading.Thread.Sleep(milliseconds);
                    }
                }

                result.Success = true;
                new AppFlows.Test(result);

            }
            catch (System.Exception ex)
            {
                new AppFlows.Test.Exception(ex, ref result);
                result.FailMessages.Add("Exception: " + ex.Message);
            }
            return result;
        }

    }
}
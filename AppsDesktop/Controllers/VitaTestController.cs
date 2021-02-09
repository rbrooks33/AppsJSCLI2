using System;
using System.Collections.Generic;
using System.Linq;
using AppsDesktop;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace AppsDesktop
{
    public class Result
    {
        public Result()
        {
            Logs = new List<string>();
        }
        public bool Success { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public List<string> Logs { get; set; }
    }

    public class VitaTestController : Controller
    {
        private static string dbPath = Environment.CurrentDirectory + "\\AppsJSDB.db";

        private IHostingEnvironment _env;

        public VitaTestController(IHostingEnvironment env)
        {
            _env = env;
        }

        //[HttpGet]
        //[Route("api/{controller}/GetSoftwares")]
        //public Result GetSoftwares()
        //{
        //    var result = new Result();

        //    try
        //    {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {
        //                var softwares = dblocal.GetCollection<Software>("Softwares"); // db.Softwares.Add(software);

        //                result.Data = softwares.FindAll().ToList();
        //                result.Success = true;
        //            }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetSoftware")]
        //[HttpGet]
        //public Result GetSoftware(int softwareId)
        //{
        //    var result = new Result();

        //    try
        //    {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {
        //                var softwares = dblocal.GetCollection<Software>("Softwares"); // db.Softwares.Add(software);

        //                result.Data = softwares.FindAll().ToList().Where(s => s.SoftwareID == softwareId);
        //                result.Success = true;
        //            }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}

        //[Route("GetRequirements")]
        //[HttpGet]
        //public Result GetRequirements(string db, int softwareId)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {
        //            var softwares = dblocal.GetCollection<SoftwareRequirement>("SoftwareRequirements").Find(Query.EQ("SoftwareID", softwareId)); // db.Softwares.Add(software);

        //            result.Data = softwares.ToList();
        //            result.Success = true;
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}

        //[Route("AddSoftware")]
        //[HttpPost]
        //public Result AddSoftware(string db, [FromBody]Software software)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //         {
        //            var softwares = dblocal.GetCollection<Software>("Softwares"); // db.Softwares.Add(software);
        //            softwares.Upsert(software);

        //            result.Data = softwares.FindAll().ToList();
        //            result.Success = true;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetRequirements")]
        //[HttpGet]
        //public Result GetRequirements()
        //{
        //    var result = new Result();

        //    try
        //    {
        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {
        //            var reqs = dblocal.GetCollection<SoftwareRequirement>("SoftwareRequirements"); // db.Softwares.Add(software);

        //            result.Data = reqs.FindAll().ToList();
        //            result.Success = true;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}

        //[Route("AddRequirement")]
        //[HttpPost]
        //public Result AddRequirement(string db, [FromBody]SoftwareRequirement requirement)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {

        //            var reqs = dblocal.GetCollection<SoftwareRequirement>("SoftwareRequirements"); // db.Softwares.Add(software);
        //            reqs.Upsert(requirement);

        //            result.Data = reqs.FindAll().ToList();
        //            result.Success = true;
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}

        //[Route("GetTestsPlans")]
        //[HttpGet]
        //public Result GetTestPlans(string db, int softwareId)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {
        //            var testplans = dblocal.GetCollection<TestPlan>("TestPlans").FindAll().Where(tp => tp.SoftwareID == softwareId).ToList();
        //            result.Data = testplans;
        //            result.Success = true;
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetTests")]
        //[HttpGet]
        //public Result GetTests(string db)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {
        //            var tests = dblocal.GetCollection<Test>("Tests").FindAll().ToList(); //.Where(tp => tp.SoftwareID == softwareId).ToList();
        //            result.Data = tests;
        //            result.Success = true;
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetTestsByRequirement")]
        //[HttpGet]
        //public Result GetTestsByRequirement(string db, int softwareRequirementId)
        //{
        //    var result = new Result();
        //    var testList = new List<Test>();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {
        //            //var reqTests = dblocal
        //            //    .GetCollection<RequirementTest>("RequirementTests")
        //            //    .Find(Query.EQ("SoftwareRequirementID", softwareRequirementId))
        //            //    .ToList();

        //            var tests = dblocal.GetCollection<Test>("Tests").Find(Query.EQ("RequirementID", softwareRequirementId)).ToList(); //.FindAll().ToList(); /.Where(tp => tp.SoftwareID == softwareId).ToList();

        //            //foreach(var test in tests)
        //            //{
        //            //    foreach(var req in reqTests)
        //            //    {
        //            //        if (req.TestID == test.TestID)
        //            //            testList.Add(test);
        //            //    }
        //            //}
        //            result.Data = tests;
        //            result.Success = true;
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetFuncSpecsBySoftwareID")]
        //[HttpGet]
        //public Result GetFuncSpecsBySoftwareID(string db, int softwareId)
        //{
        //    var result = new Result();
        //    var testList = new List<Test>();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        if (useEF)
        //        {
        //            //using (var dbremote = new AppsJSContextEF())
        //            //{
        //            //    result.Data = dbremote.TestSteps.ToList().Where(ts => ts.TestID == testId);
        //            //    result.Success = true;
        //            //}

        //        }
        //        else
        //        {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {
        //                var funcspecs = dblocal.GetCollection<FuncSpec>("FuncSpecs").FindAll().ToList().Where(fs => fs.SoftwareID == softwareId); 

        //                result.Data = funcspecs;
        //                result.Success = true;
        //            }
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}


        //[Route("open")]
        //[HttpPost]
        //public Result Open()
        //{
        //    var result = new Result();

        //    try
        //    {

        //        result.Data = "hiya";
        //        result.Success = true;
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }
        //    return result;
        //}

        //[Route("save")]
        //[HttpPost]
        //public Result Save()
        //{
        //    var result = new Result();

        //    try
        //    {
        //        if (HttpContext.Request.Form.Count == 2)
        //        {
        //            string fileName = HttpContext.Request.Form["filename"].ToString();
        //            string xml = HttpContext.Request.Form["xml"].ToString();
        //            string saveDirectory = @"C:\Users\rbrooks\source\repos\AppsJSCore\wwwroot\Scripts\Apps\Components\VitaTest";
        //            string savePath = saveDirectory + "\\" + fileName;

        //            System.IO.File.WriteAllText(savePath, System.Web.HttpUtility.UrlDecode(xml));

        //            //result.Data = "hiya";
        //            result.Success = true;
        //        }
        //        else
        //            result.Message = "Expecting to Form items.";
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }
        //    return result;
        //}

        //[Route("UpsertFuncSpec")]
        //[HttpPost]
        //public Result UpsertFuncSpec(string db, [FromBody]FuncSpec funcSpec)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        if (useEF)
        //        {
        //            //using (var dbremote = new AppsJSContextEF())
        //            //{
        //            //    if (step.TestStepID > 0)
        //            //        dbremote.TestSteps.Update(step);
        //            //    else
        //            //        dbremote.TestSteps.Add(step);

        //            //    dbremote.SaveChanges();
        //            //    result.Success = true;
        //            //}
        //        }
        //        else
        //        {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {

        //                var tests = dblocal.GetCollection<FuncSpec>("FuncSpecs");
        //                tests.Upsert(funcSpec);

        //                result.Data = tests.FindAll().ToList();
        //                result.Success = true;
        //            }
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}

        //[Route("GetTestStepsByTest")]
        //[HttpGet]
        //public Result GetTestStepsByTest(string db, int testId)
        //{
        //    var result = new Result();
        //    var testList = new List<Test>();

        //    try
        //    {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {
        //                var steps = dblocal.GetCollection<TestStep>("TestSteps").FindAll().ToList().Where(ts => ts.TestID == testId); //.Find(Query.EQ("TestID", softwareRequirementId)).ToList(); //.FindAll().ToList(); /.Where(tp => tp.SoftwareID == softwareId).ToList();

        //                result.Data = steps;
        //                result.Success = true;
        //            }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}


        //[Route("AddTest")]
        //[HttpPost]
        //public Result AddTest([FromBody]Test test)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {

        //            var tests = dblocal.GetCollection<Test>("Tests"); 
        //            tests.Upsert(test);

        //            result.Data = tests.FindAll().ToList();
        //            result.Success = true;
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("UpsertStep")]
        //[HttpPost]
        //public Result UpsertStep(string db, [FromBody]TestStep step)
        //{
        //    var result = new Result();

        //    try
        //    {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {

        //                var tests = dblocal.GetCollection<TestStep>("TestSteps");
        //                tests.Upsert(step);

        //                result.Data = tests.FindAll().ToList();
        //                result.Success = true;
        //            }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetNewRunInstance")]
        //[HttpGet]
        //public Result GetNewRunInstance(string db, int testId)
        //{
        //    var result = new Result();

        //    try
        //    {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {
        //                var runInstances = dblocal.GetCollection<TestRunInstance>("TestRunInstances"); //.FindAll().ToList().Where(ts => ts.TestID == testId); //.Find(Query.EQ("TestID", softwareRequirementId)).ToList(); //.FindAll().ToList(); /.Where(tp => tp.SoftwareID == softwareId).ToList();

        //                var newRunInstance = new TestRunInstance()
        //                {
        //                    DateCreated = DateTime.Now,
        //                    Description = "",
        //                    Name = "",
        //                    ReleaseID = 0,
        //                    TestID = testId
        //                };

        //                runInstances.Upsert(newRunInstance);

        //                result.Data = newRunInstance;
        //                result.Success = true;
        //            }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}

        //[Route("GetRunInstances")]
        //[HttpGet]
        //public Result GetRunInstances(string db, int testId)
        //{
        //    var result = new Result();
        //    var runList = new List<TestRun>();

        //    try
        //    {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {
        //                var instances = dblocal.GetCollection<TestRunInstance>("TestRunInstances").FindAll().ToList().Where(ts => ts.TestID == testId); //.Find(Query.EQ("TestID", softwareRequirementId)).ToList(); //.FindAll().ToList(); /.Where(tp => tp.SoftwareID == softwareId).ToList();
        //                foreach(var inst in instances)
        //                {
        //                    var instRuns = dblocal.GetCollection<TestRun>("TestRuns").FindAll().ToList().Where(tr => tr.TestRunInstanceID == inst.TestRunInstanceID);

        //                    if (instRuns.Count() > 0)
        //                        runList.AddRange(instRuns);
        //                }
        //                result.Data = runList;
        //                result.Success = true;
        //            }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetRunsByInstance")]
        //[HttpGet]
        //public Result GetRunsByTest(string db, int testRunInstanceId)
        //{
        //    var result = new Result();
        //    var testList = new List<Test>();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        if (useEF)
        //        {
        //            //using (var dbremote = new AppsJSContextEF())
        //            //{
        //            //    result.Data = dbremote.TestSteps.ToList().Where(ts => ts.TestID == testId);
        //            //    result.Success = true;
        //            //}

        //        }
        //        else
        //        {
        //            using (var dblocal = new LiteDatabase(dbPath))
        //            {
        //                var runs = dblocal.GetCollection<TestRun>("TestRuns").FindAll().ToList().Where(tr => tr.TestRunInstanceID == testRunInstanceId); 

        //                result.Data = runs;
        //                result.Success = true;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        [Route("UpsertRun")]
        [HttpPost]
        public Result UpsertRun(string db, [FromBody]TestRun run)
        {
            var result = new Result();

            try
            {
                var useEF = db == "remote";

                if (useEF)
                {
                    //using (var dbremote = new AppsJSContextEF())
                    //{
                    //    if (step.TestStepID > 0)
                    //        dbremote.TestSteps.Update(step);
                    //    else
                    //        dbremote.TestSteps.Add(step);

                    //    dbremote.SaveChanges();
                    //    result.Success = true;
                    //}
                }
                else
                {
                    using (var dblocal = new LiteDatabase(dbPath))
                    {

                        var runs = dblocal.GetCollection<TestRun>("TestRuns");

                        if (run.Passed)
                            run.DatePassed = DateTime.Now;
                        else
                            run.DateFailed = DateTime.Now;


                        runs.Upsert(run);

                        result.Success = true;
                    }
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetParameters")]
        [HttpGet]
        public Result GetParameters(string db, int testId)
        {
            var result = new Result();
            var runList = new List<TestRun>();

            try
            {
                    using (var dblocal = new LiteDatabase(dbPath))
                    {
                        var instances = dblocal.GetCollection<TestParameter>("TestParameters").FindAll().ToList().Where(ts => ts.TestID == testId); //.Find(Query.EQ("TestID", softwareRequirementId)).ToList(); //.FindAll().ToList(); /.Where(tp => tp.SoftwareID == softwareId).ToList();
                        result.Data = instances;
                        result.Success = true;
                    }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("UpsertParameter")]
        [HttpPost]
        public Result UpsertParameter(string db, [FromBody]TestParameter parameter)
        {
            var result = new Result();

            try
            {
                var useEF = db == "remote";

                if (useEF)
                {
                    //using (var dbremote = new AppsJSContextEF())
                    //{
                    //    if (step.TestStepID > 0)
                    //        dbremote.TestSteps.Update(step);
                    //    else
                    //        dbremote.TestSteps.Add(step);

                    //    dbremote.SaveChanges();
                    //    result.Success = true;
                    //}
                }
                else
                {
                    using (var dblocal = new LiteDatabase(dbPath))
                    {

                        var parameters = dblocal.GetCollection<TestParameter>("TestParameters");

                        parameters.Upsert(parameter);

                        result.Data = parameter;
                        result.Success = true;
                    }
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        /// <summary>
        /// NOTE: Primary key is Host (host can only test one test at a time)
        /// A test call will come in with a host name and 
        /// either a testid in the querystring or not
        /// 
        /// If the testid exists, it's the first call: upsert and return testid (can use querystring but for consistency)
        /// If host only, it's a subsequent call: get and return testid
        /// </summary>
        /// <param name="sut"></param>
        /// <returns></returns>
        //[Route("UpsertSUT")]
        //[HttpPost]
        //public Result UpsertSUT(string db, [FromBody]SUT sut)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {
        //            var suts = dblocal.GetCollection<SUT>("SUTs");

        //            var existingSutsForHost = suts.Find(Query.EQ("Host", sut.Host)); //, Query.EQ("TestID", sut.TestID))); //should only be one

        //            if (existingSutsForHost.Count() == 1)
        //            {
        //                var existingSut = existingSutsForHost.Single();

        //                result.Logs.Add("Sunny day: Should find either 1 or 0 hosts.");
        //                if (sut.TestID > 0)
        //                {
        //                    result.Logs.Add("Sunny day: First call (and Test changes) will have a test id, update.");
        //                    existingSut.TestID = sut.TestID;
        //                    suts.Upsert(existingSut);
        //                    sut = existingSut; //Pass back new one
        //                    result.Success = true;
        //                }
        //                else
        //                {
        //                    result.Logs.Add("Sunny day: Subsequent call with only host and no TestID, pass back saved TestID if exists.");
        //                    if (existingSut.TestID > 0)
        //                    {
        //                        result.Logs.Add("Very sunny day: TestID found.");
        //                        sut.TestID = existingSut.TestID;
        //                        result.Success = true;
        //                    }
        //                    else
        //                        result.Logs.Add("Host found but no TestID passed and no TestID associated with database record for host.");
        //                }
        //            }
        //            else if (existingSutsForHost.Count() == 0)
        //            {
        //                result.Logs.Add("Sunny day: New call from Host. Any new TestID from Host resets the record (so call MUST contain a TestID)");
        //                if (sut.TestID > 0)
        //                {
        //                    result.Logs.Add("Sunny day: TestID passed in. Just create a record and return");
        //                    var newSut = new SUT();
        //                    newSut.TestID = sut.TestID;
        //                    newSut.Host = sut.Host;
        //                    suts.Upsert(newSut);
        //                    sut = newSut;
        //                    result.Success = true;
        //                }
        //                else
        //                    result.Logs.Add("No host found but cannot create a record because no TestID passed in.");
        //            }

        //            result.Data = sut; 
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetSUT")]
        //[HttpPost]
        //public Result GetSUT(string db, [FromBody]SUT sut)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {

        //            var suts = dblocal.GetCollection<SUT>("SUTs"); // db.Softwares.Add(software);
        //            suts.Upsert(sut);

        //            result.Data = suts.FindAll().ToList();
        //            result.Success = true;
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
        //[Route("GetSUTByTestID")]
        //[HttpGet]
        //public Result GetSUTByTestID(string db, int testId)
        //{
        //    var result = new Result();

        //    try
        //    {
        //        var useEF = db == "remote";

        //        using (var dblocal = new LiteDatabase(dbPath))
        //        {
        //            //If coming from a new test we need to get the host from software
        //            var tests = dblocal.GetCollection<Test>("Tests").FindAll().ToList().Where(t => t.TestID == testId);
        //            if (tests.Count() == 1)
        //            {
        //                var test = tests.Single();
        //                //get requirement

        //                var reqs = dblocal.GetCollection<SoftwareRequirement>("SoftwareRequirements").FindAll().ToList().Where(r => r.SoftwareRequirementID == test.RequirementID).ToList();

        //                if (reqs.Count() == 1)
        //                {
        //                    var req = reqs.Single();
        //                    var softwares = dblocal.GetCollection<Software>("Softwares").FindAll().ToList().Where(s => s.SoftwareID == req.SoftwareID).ToList();

        //                    if (softwares.Count() == 1)
        //                    {
        //                        var software = softwares.Single();

        //                        //check if already exists (rule: one sut per host)
        //                        var suts = dblocal.GetCollection<SUT>("SUTs").FindAll().ToList().Where(sut => sut.Host == software.Host).ToList(); // db.Softwares.Add(software);
        //                        if (suts.Count() == 1)
        //                        {
        //                            result.Logs.Add("Updating sut with testid.");

        //                            var sut = suts.Single();
        //                            sut.TestID = testId;

        //                            UpsertSUT(db, sut); //save sut

        //                            result.Data = sut;
        //                            result.Success = true;
        //                        }
        //                        else if (suts.Count() == 0)
        //                        {
        //                            result.Logs.Add("Creating new sut.");

        //                            var newSut = new SUT();
        //                            newSut.Host = software.Host;
        //                            newSut.TestID = testId;
        //                            UpsertSUT(db, newSut);

        //                            result.Data = newSut;
        //                            result.Success = true;
        //                        }
        //                        else
        //                        {
        //                            result.Logs.Add("More than one host in suts: " + suts.Count().ToString());
        //                        }
        //                    }
        //                    else
        //                        result.Logs.Add("Software count from req software id " + req.SoftwareID.ToString() + " not zero: " + softwares.Count().ToString());
        //                }
        //                else
        //                    result.Logs.Add("No requirement found for that test id.");
        //            }
        //            else
        //                result.Logs.Add("Non single test found for testid " + testId.ToString() + ": " + tests.Count().ToString());
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Data = ex;
        //    }

        //    return result;
        //}
    }

}

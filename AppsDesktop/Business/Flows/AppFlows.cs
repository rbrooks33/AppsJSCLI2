using Flows;

namespace AppFlows
{
    //Apps DevOps Roles (using built-in roles)
    public enum Roles
    {

    }
    //{
    //    new AppsDesktop.Role()
    //    {
    //        RoleName = "Architect",
    //        RoleDescription = @"Uses Apps DevOps to create Flow class or document.
    //                            the Architect can plan as much detail as desired to
    //                            and leave more detailed arch. decisions to the developer."
    //    },
    //    new AppsDesktop.Role()
    //    {
    //         RoleName = "Developer",
    //         RoleDescription = @"Develops software and uses Apps DevOps to plan, 
    //                                document, test and track the local software."
    //    },
    //    new AppsDesktop.Role()
    //    {
    //        RoleName = "Tester/QA",
    //        RoleDescription = @"Uses Apps DevOps to individually run automated or 
    //                                manual tests and configures automation for Ops."
    //    },
    //    new AppsDesktop.Role()
    //    {
    //        RoleName = "Ops",
    //        RoleDescription = @"Configures, schedules and tracks publishing 
    //                                and automated test results. Tracks system performance and metrics."
    //    },
    //    new AppsDesktop.Role()
    //    {
    //        RoleName = "Product Owner",
    //        RoleDescription = @"Tracks progress of plan coverage during development
    //                                and tracks data metrics during production."
    //    }

    //Apps DevOps Components

    //Plan Component
    public class Plan
    {
        //public class PlanDocs : AppsDoc
        //{
        //    public PlanDocs()
        //    {
        //        base.SoftwareDocs = new SoftwareDocs()
        //        {
        //            Softwares = new System.Collections.Generic.List<Software>()
        //             {
        //                 new Software()
        //                 {
        //                     SoftwareName = "Apps DevOps Desktop Application",
        //                     SoftwareType = SoftwareTypes.CoreDesktopApp,
        //                     Stories = new System.Collections.Generic.List<SoftwareStory>()
        //                     {
        //                          new SoftwareStory()
        //                          {
        //                              StoryName = @"As a developer I want to plan my code.",

        //                          },
        //                          new SoftwareStory()
        //                          {
        //                              StoryName = "As a developer I want to immediately test my code."
        //                          }
        //                      }
        //                 }
        //             }
        //        };
        //    }
        //}

        public class PlanTests : AppsTest
        {
            public PlanTests()
            {
                //Plan Docs

                //Plan Component Testing
                //base.TestPlan = new TestPlan()
                //{
                //    TestPlanName = "",
                //    TestPlanDescription = "Tests will cover Apps ability to help plan for and during software development.",
                //    TestScenarios = new System.Collections.Generic.List<TestScenario>()
                //{
                //    new TestScenario()
                //    {
                //        Scenario = @"Developer Joe has a new assignment to build the UI test component for Apps DevOps testing.
                //                    He knows the architecture is made up of a static class called 'Flows' that the developer has
                //                    statically populated with his tests. His job is to create a UI that 1.) Reads the 'Flows' class
                //                    (and children classes) and show them along with any new tests created. Those new tests
                //                    will then be shown alongside the static ones."
                //    },
                //    new TestScenario()
                //    {
                //        Scenario = ""
                //    }
                //},
                //    Tests = new System.Collections.Generic.List<Test>()  {
                //       new AppsClientFlows.Test()
                //       {
                //           TestDescription = "Edit/Save an App",
                //            Steps = new System.Collections.Generic.List<TestStep>()
                //            {
                //                new TestStep()
                //                {
                //                     Order = 1,
                //                     Instructions = "Find App and click on menu bar 'Edit' menu item.",
                //                     Expectations = "Should open up App edit dialog."

                //                },
                //                new TestStep()
                //                {
                //                    Order = 2,
                //                    Instructions = "Enter name and description and click Save.",
                //                    Expectations = "Dialog should go away."
                //                },
                //                new TestStep()
                //                {
                //                    Order = 3,
                //                    Instructions = "Click on edit menu item again.",
                //                    Expectations = "App edit dialog should show up with entered values."
                //                }
                //            }
                //       },
                //       new Test()
                //       {
                //           TestDescription = ""
                //       }
                //    }
                //};
            }
        }
        //Plan Component Flows
        public class Apps : AppFlow
        {
            public string AppMessage { get; set; }
            public Apps(string message)
            {
                AppMessage = message;
                base.End();
            }

            public class Exception : AppFlow
            {
                public Exception(System.Exception ex, ref AppsClient.AppsResult result)
                {
                    this.Color = "red";
                    this.ExceptionAndResult(ex, ref result);
                }
            }

            public class GetApps : AppFlow
            {
                public int AppCount;
                public GetApps(int appCount)
                {
                    this.AppCount = appCount;
                    this.Color = "green";
                    this.End();
                }
            }

            public class Stories : AppFlow
            {
                public Stories()
                {
                    this.End();
                }
                public class Exception : AppFlow
                {
                    public Exception(System.Exception ex, ref AppsClient.AppsResult result)
                    {
                        this.Color = "red";
                        this.ExceptionAndResult(ex, ref result);
                    }
                }
            }
        }

    }

    public class Create : AppFlow
    {
        public Create(int appId, string message)
        {
            this.Color = "blue";
            this.FlowProps.Add("Message", message);
            this.FlowProps.Add("AppID", appId.ToString());
            this.End();
        }

        public class Fail : AppFlow
        {
            public Fail(string message, ref AppsClient.AppsResult result)
            {
                result.FailMessages.Add(message);
                this.FlowProps.Add("Message", message);
                this.Color = "orange";
                this.End();
            }
        }

        public class Exception : AppFlow
        {
            public Exception(System.Exception ex, ref AppsClient.AppsResult result)
            {
                this.Color = "red";
                this.ExceptionAndResult(ex, ref result);
            }
        }
    }
    public class Test
    {
        public class Exception : AppFlow
        {
            public Exception(System.Exception ex, ref AppsClient.AppsResult result)
            {
                this.Color = "red";
                this.ExceptionAndResult(ex, ref result);
            }
        }

    }

    public class Develop
    {
        public class Exception : AppFlow
        {
            public Exception(System.Exception ex, ref AppsClient.AppsResult result)
            {
                this.Color = "red";
                this.ExceptionAndResult(ex, ref result);
            }
        }

    }

    //Apps DevOps Publish Component
    public class Publish
    {
        public class Compile : AppFlow
        {
            public string Message;

            public Compile(string message)
            {
                this.Message = message;
                this.End();
            }
            public class CompileSuccess : AppFlow
            {
                public string Result { get; set; }

                public CompileSuccess(ref AppsClient.AppsResult result)
                {
                    this.Result = Newtonsoft.Json.JsonConvert.SerializeObject(result);
                    this.Color = "green";
                    this.End();
                }

            }
            public class Fail : AppFlow
            {
                public string Message;
                public Fail(string failMessage, ref AppsClient.AppsResult result)
                {
                    Message = failMessage;
                    //base.Signal(failMessage);
                    base.Color = "orange";
                    base.End();
                }
            }

            public class Exception : AppFlow
            {
                public Exception(System.Exception ex, ref AppsClient.AppsResult result)
                {
                    this.Color = "red";
                    this.ExceptionAndResult(ex, ref result);
                }
            }

        }

        public class Exception : AppFlow
        {
            public Exception(System.Exception ex, ref AppsClient.AppsResult result)
            {
                this.Color = "red";
                this.ExceptionAndResult(ex, ref result);
            }
        }

        public class Success : AppFlow
        {
            public string Message { get; set; }

            public Success(string message)
            {
                this.Message = message;
                this.Color = "green";
                this.End();
            }

        }
        public class Fail : AppFlow
        {
            public string Message;

            public Fail(string failMessage, ref AppsClient.AppsResult result)
            {
                Message = failMessage;
                base.Signal(failMessage);
                base.Color = "orange";
                base.End();
            }
        }
    }

    //Apps DevOps Track Component
    public class Track
    {

    }

    //Apps DevOps Helpers Component
    public class Helpers
    {
        public class AppsSystem : AppFlow
        {
            public AppsSystem() { base.End(); }

            public class Initialize : AppFlow
            {
                public Initialize() { base.End(); }

                public class AppUpdated : AppFlow
                {
                    public int AppIdUpdated;
                    public AppUpdated(int appIdUpdated)
                    {
                        AppIdUpdated = appIdUpdated;
                        base.End();
                    }
                }

                public class Step2 : AppFlow
                {
                    public Step2() { base.End(); }
                }

            }
            public class Exception : AppFlow
            {
                public Exception(System.Exception ex, ref AppsClient.AppsResult result)
                {
                    this.Color = "red";
                    this.ExceptionAndResult(ex, ref result);
                }
            }

        }

    }

}

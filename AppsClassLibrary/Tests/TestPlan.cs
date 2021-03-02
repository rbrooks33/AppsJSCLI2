using AppsDesktop;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Flows
{
    public class TestPlan
    {
        public TestPlan()
        {
            Tests = new List<Test>();
            TestScenarios = new List<TestScenario>();
            TestRoles = new List<Role>();
        }
        [Key]
        public int ID { get; set; }
        public string TestPlanName { get; set; }
        public string TestPlanDescription { get; set; }
        public int AppID { get; set; }
        public bool Archived { get; set; }
      
        public List<Test> Tests { get; set; }
        public List<TestScenario> TestScenarios {get;set;}
        public List<Role> TestRoles { get; set; }
    }
}
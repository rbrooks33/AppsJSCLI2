using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AppsDesktop
{
    public class TestPlan
    {
        [Key]
        public int TestPlanID { get; set; }
        public string TestPlanName { get; set; }
        public string TestPlanDescription { get; set; }
        public int SoftwareID { get; set; }
        public bool Archived { get; set; }
        public List<Test> Tests { get; set; }
        public List<TestScenario> TestScenarios {get;set;}
        public List<Role> TestRoles { get; set; }
    }
}
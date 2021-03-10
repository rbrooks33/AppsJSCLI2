using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Flows
{
    public class Test
    {
        public Test()
        {
            Steps = new List<TestStep>();
        }
        [Key]
        public int ID { get; set; }
        public int TestPlanID { get; set; }
        public int RequirementID { get; set; } //i think temp
        public string TestName { get; set; }
        public string TestDescription { get; set; }
        public string TFSTestID { get; set; }
        public double Order { get; set; }
        public string Category { get; set; }
        public bool Ready { get; set; }
        public bool Passed { get; set; }
        public string JSFunction { get; set; }
        public string JSScript { get; set; }
        public bool Archived { get; set; }
        public string Results { get; set; }
        public List<TestStep> Steps { get; set; }
    }
}
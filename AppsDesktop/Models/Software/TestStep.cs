using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AppsDesktop
{
    public class TestStep
    {
        public TestStep()
        {
            Passed = -1;
        }
        [Key]
        public int TestStepID { get; set; }
        public int TestID { get; set; }
        public string PreConditions { get; set; }
        public string Instructions { get; set; }
        public string Expectations { get; set; }
        public string Variations { get; set; }
        public double Order { get; set; }
        public int Passed { get; set; }
        public bool Archived { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Flows
{
    public class TestRun
    {
        public TestRun()
        {
            DateCreated = DateTime.Now;
        }

        [Key]
        public int TestRunID { get; set; }
        public int TestStepID { get; set; }
        public int TestRunInstanceID { get; set; }
        public bool Passed { get; set; }
        public bool IsNote { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DatePassed { get; set; }
        public DateTime DateFailed { get; set; }
        public DateTime DateArchived { get; set; }
    }
}
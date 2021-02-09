using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Flows
{
    public class TestPlanInstance
    {
        [Key]
        public int TestPlanInstanceID { get; set; }
        public int TestPlanID { get; set; }
        public int ReleaseID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
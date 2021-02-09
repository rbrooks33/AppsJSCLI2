using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AppsDesktop
{
    public class TestRunInstance
    {
        [Key]
        public int TestRunInstanceID { get; set; }
        public int TestID { get; set; }
        public int ReleaseID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
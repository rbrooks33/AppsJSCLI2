using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class SUT
    {
        [Key]
        public int SUTID { get; set; }
        public string Host { get; set; }
        public int TestID { get; set; }
    }
}

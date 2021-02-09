using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class TestParameter
    {
        [Key]
        public int TestParameterID { get; set; }
        public int TestID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}

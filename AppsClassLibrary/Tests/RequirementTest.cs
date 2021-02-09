using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class RequirementTest
    {
        [Key]
        public int RequirementTestID { get; set; }
        public int RequirementID { get; set; }
        public int TestID { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Flows
{
    public class SoftwareFuncSpec
    {
        [Key]
        public int SoftwareFuncSpecID { get; set; }
        public int SoftwareID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}

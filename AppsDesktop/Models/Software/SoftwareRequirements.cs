using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AppsDesktop
{
    public class SoftwareRequirement
    {
        [Key]
        public int SoftwareRequirementID { get; set; }
        public int SoftwareID { get; set; }
        public string SoftwareRequirementName { get; set; }
        public string SoftwareRequirementDescription { get; set; }
        public double Order { get; set; }
        public string Color { get; set; }
        public string Grabbed { get; set; }
        public string Latest { get; set; }
        public bool Archived { get; set; }
    }
}
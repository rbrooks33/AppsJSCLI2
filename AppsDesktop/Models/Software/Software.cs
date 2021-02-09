using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AppsClient
{
    [Table("Software")]
    public class Software
    {
        [Key]
        public int SoftwareID { get; set; }
        public string Host { get; set; }
        public string SoftwareName { get; set; }
        public SoftwareTypes SoftwareType { get; set; }
        public string Description { get; set; }
        public bool Archived { get; set; }
        public bool LocalHostOnly { get; set; }
        public List<Story> Stories { get; set; }
        public List<SoftwareFile> SoftwareFiles { get; set; }
        public List<FuncSpec> FuncSpecs { get; set; }
    }
}
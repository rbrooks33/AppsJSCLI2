using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class SoftwareDocs
    {
        [Key]
        public int SoftwareDocsID { get; set; }
        public List<Software> Softwares { get; set; }
    }
}

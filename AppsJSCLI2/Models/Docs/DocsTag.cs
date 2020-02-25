using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSDev.Models.Docs
{
    public class DocsTag
    {
        [Key]
        public int DocsTagID { get; set; }
        public int DocID { get; set; }
        public int TagID { get; set; }
    }
}

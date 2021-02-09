using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AppsDesktop.Models.Docs
{
    public class DocType
    {
        [Key]
        public int DocTypeID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string SearchURL { get; set; }
        public string GetDocURL { get; set; }
        public string CreateLinkJS { get; set; }
        public string Logo { get; set; }
    }
}
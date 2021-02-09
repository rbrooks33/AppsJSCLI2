using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1.Models.Vitacost
{
    public class TemplateName
    {
        [Key]
        public int templateID { get; set; }
        public int? templateTypeID { get; set; }
        public string templateName { get; set; }
        //public string templateHTML { get; set; }
        public bool isEnabled { get; set; }
        public DateTime DateEntered { get; set; }
        public string DateEnteredWho { get; set; }
        public DateTime? DateLastModified { get; set; }
        public string DateLastModifiedWho { get; set; }
    }
}

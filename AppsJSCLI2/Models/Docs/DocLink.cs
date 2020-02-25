using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSDev.Models.Docs
{
    public class DocLink
    {
        public DocLink()
        {
            ChildCreated = DateTime.Now; //TODO rename to link created
        }
        [Key]
        public long DocLinkID { get; set; }
        public string ParentTitle { get; set; }
        public int ParentDocTypeID { get; set; }
        public long ParentDocID { get; set; }
        public string ParentGetDocURL { get; set; }
        public int ChildDocTypeID { get; set; }
        public long ChildDocID { get; set; }
        public string ChildGetDocURL { get; set; }
        public string ChildServerURL { get; set; }
        public DateTime ChildLastUpdated { get; set; }
        public DateTime ChildCreated { get; set; }
        public string ChildContent { get; set; }
        public string ChildTitle { get; set; }

    }
}

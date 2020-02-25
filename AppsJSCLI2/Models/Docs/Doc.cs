using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AppsJSDev.Models.Docs
{
    public class Doc
    {
        public Doc()
        {
            DocTypeID = 0; //unknown
            Created = DateTime.Now;
            Order = 0;
        }
        [Key]
        public int DocID { get; set; }
        public int DocTypeID { get; set; }
        public int UniqueID { get; set; } //ID unique within the doc type
        public int ProjectID { get; set; }
        [Required]
        [StringLength(50)]
        public string DocTitle { get; set; }
        public string DocContent { get; set; }
        public int? ParentDocID { get; set; }
        public DateTime Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Updated { get; set; }
        public string UpdateBy { get; set; }
        public bool Archived { get; set; }
        public bool ArchivedBy { get; set; }
        public int ChildCount { get; set; }
        public double Order { get; set; }
    }
}
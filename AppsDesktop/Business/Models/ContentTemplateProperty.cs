using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Brooksoft.Apps.Business.Models
{
    public class ContentTemplateProperty
    {
        public ContentTemplateProperty()
        {
            Created = DateTime.Now;
        }
        [Key]
        public int ID { get; set; }
        public int TemplateID { get; set; }
        public string TemplatePropertyFind { get; set; }
        public string TemplatePropertyReplace { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }

    }
}

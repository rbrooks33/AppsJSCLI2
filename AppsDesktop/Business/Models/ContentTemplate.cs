using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Brooksoft.Apps.Business.Models
{
    public class ContentTemplate
    {
        public ContentTemplate()
        {
            TemplateProperties = new List<ContentTemplateProperty>();
            Created = DateTime.Now;
        }
        [Key]
        public int ID { get; set; }
        public string TemplateName { get; set; }
        public string TemplateContent { get; set; }
        public List<ContentTemplateProperty> TemplateProperties { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
    }
}

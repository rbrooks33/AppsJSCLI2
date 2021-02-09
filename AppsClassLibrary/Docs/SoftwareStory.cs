using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Flows
{
    public class SoftwareStory
    {
        public SoftwareStory()
        {
            Created = DateTime.Now;
        }
        [Key]
        public int StoryID { get; set; }
        public int AppID { get; set; }
        public string StoryName { get; set; }
        public string StoryDescription { get; set; }
        public int TestPlanID { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
    }
}

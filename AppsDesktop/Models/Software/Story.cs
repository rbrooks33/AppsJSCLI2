using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class Story
    {
        [Key]
        public int StoryID { get; set; }
        public Role Role { get; set; }
        public string StoryName { get; set; }
        public string StoryDescription { get; set; }
        public List<App> AppLinks { get; set; }
        public int TestPlanID { get; set; }
    }
}

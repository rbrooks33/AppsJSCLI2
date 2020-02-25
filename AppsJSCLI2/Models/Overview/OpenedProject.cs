using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSCLI2.Models
{
    public class OpenedProjects
    {
        public OpenedProjects()
        {
            Projects = new List<OpenedProject>();
        }
        public List<OpenedProject> Projects { get; set; }
    }
    public class OpenedProject
    {
        public string  Name { get; set; }
        public string Path { get; set; }
        public DateTime LastOpened { get; set; }
    }
}

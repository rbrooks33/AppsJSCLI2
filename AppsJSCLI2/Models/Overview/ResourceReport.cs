using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSCLI2.Models
{
    public class ResourceReport
    {
        public ResourceReport()
        {
            Resources = new List<Resource>();
        }
        public List<Resource> Resources { get; set; }
    }

    public class Resource
    {
        public Resource(string name, string fileName, string moduleType)
        {
            Name = name;
            FileName = FileName;
            ModuleType = moduleType;

            //defaults
            Enabled = true;
            LoadFirst = false;
            Order = 1;
            Description = "    ";
        }
        public string Name { get; set; }
        public bool Enabled { get; set; }
        public bool LoadFirst { get; set; }
        public int Order { get; set; }
        public string ModuleType { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
    }
}

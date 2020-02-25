using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSCLI2.Models.Configs
{
    public class FoundDirectories
    {
        public FoundDirectories()
        {
            Directories = new List<FoundDirectory>();
        }
        public List<FoundDirectory> Directories { get; set; }
    }
    public class FoundDirectory
    {
        public string Path { get; set; }
        public bool Archived { get; set; }
        public DateTime PathVerifiedDate { get; set; }
        public string FriendlyName { get; set; }
    }
}

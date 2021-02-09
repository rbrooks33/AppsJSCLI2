using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class SoftwareFile
    {
        public SoftwareFile()
        {
            SoftwareFileCodes = new List<SoftwareFileCode>();
        }
        public int AppID { get; set; }
        public int SoftwareFileID { get; set; }
        public SoftwareFileLanguages FileLanguage { get; set; }
        public string FullName { get; set; }
        public string Contents { get; set; }
        public List<SoftwareFileCode> SoftwareFileCodes { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
    }
}

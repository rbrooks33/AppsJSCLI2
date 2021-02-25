using Flows;
using System;
using System.Collections.Generic;
using System.Text;

namespace AppsClient.Docs
{
    public class Software
    {
        public Software()
        {
            SoftwareFiles = new List<SoftwareFile>();
        }
        public int SoftwareID { get; set; }
        public int AppID { get; set; }
        public List<SoftwareFile> SoftwareFiles { get; set; }
        public SoftwareTypes SoftwareType { get; set; }
    }
}

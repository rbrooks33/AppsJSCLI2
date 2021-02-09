using System;
using System.Collections.Generic;
using System.Text;

namespace AppsClient
{
    public class AppsParameters
    {
        public AppsParameters()
        {
            Parameters = new List<AppsParameter>();
        }
        public string ComponentName { get; set; }
        public string MethodName { get; set; }
        public List<AppsParameter> Parameters { get; set; }
    }
}

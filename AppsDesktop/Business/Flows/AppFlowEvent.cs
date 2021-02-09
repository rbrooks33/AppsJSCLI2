using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

    public class AppFlowEventx
    {
        public DateTime Created { get; set; }
        public AppFlowEventx()
        {
            FlowProps = new Dictionary<string, string>();
            Created = DateTime.Now;
        }
        public Dictionary<string, string> FlowProps { get; set; }
    }

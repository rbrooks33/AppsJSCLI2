using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

    public class AppFlowEvent
    {
        public DateTime Created { get; set; }
        public AppFlowEvent()
        {
            FlowProps = new Dictionary<string, string>();
            Created = DateTime.Now;
        }
        public Dictionary<string, string> FlowProps { get; set; }
    }

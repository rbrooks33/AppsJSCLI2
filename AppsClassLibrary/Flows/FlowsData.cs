using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Flows
{
    public static class FlowsData
    {
        public static string FlowsDBPath { get; set; }
        public static LiteDB.LiteDatabase FlowsDB { get; set; }
        public static LiteDB.ILiteCollection<AppFlowEvent> FlowTable { get; set; }
    }
}

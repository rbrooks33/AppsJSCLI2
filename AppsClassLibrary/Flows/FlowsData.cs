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

        public static void Load()
        {
            var flowsDb = new LiteDB.LiteDatabase(System.Environment.CurrentDirectory + "\\Flows.db");
            FlowsData.FlowTable = flowsDb.GetCollection<AppFlowEvent>("Flows");
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Flows
{
    public static class FlowUtility
    {
        public static void SaveFlow(AppFlowEvent f, AppFlow flow)
        {
            flow.Name = flow.GetType().ToString();
            flow.EndTime = DateTime.Now;
            flow.Span = flow.StartTime - flow.EndTime;

            if (String.IsNullOrEmpty(flow.Color))
            {
                flow.Color = "#000000";
            }
            //dynamic f = new System.Dynamic.ExpandoObject();
            // var f = new AppFlowEvent();
            //f.FlowName = this.Name;
            //f.Started = this.StartTime;
            //f.FlowProps = new Newtonsoft.Json.Linq.JObject();
            foreach (var prop in flow.GetType().GetProperties())
            {
                //((IDictionary<string, object>)f)[prop.Name] = prop.GetValue(this, null);
                var propVal = prop.GetValue(flow, null);
                string value = propVal != null ? propVal.ToString() : "";
                f.FlowProps.Add(prop.Name, value);
            }
            foreach (var prop in flow.GetType().GetFields())
            {
                //((IDictionary<string, object>)f)[prop.Name] = prop.GetValue(this, null);
                f.FlowProps.Add(prop.Name, prop.GetValue(flow).ToString());
            }
            FlowsData.FlowTable.Insert(f);

        }
    }
}
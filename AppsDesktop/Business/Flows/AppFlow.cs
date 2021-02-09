using System;
using System.Collections.Generic;
using System.Linq;

namespace Flows
{
    public class AppFlow
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public TimeSpan Span { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public AppFlow()
        {
            StartTime = DateTime.Now;
        }
        public void Signal(string message)
        {

        }
        public virtual void End()
        {
            var f = new AppFlowEvent();
            FlowUtility.SaveFlow(f, this);
        }
        public List<AppFlowEvent> GetFlows()
        {
            return FlowsData.FlowTable.Query().OrderByDescending(f => f.Created).ToList();
        }
    }
    public static class Exception
    {
        public static void ExceptionOnly(this AppFlow flow, System.Exception ex)
        {
            var f = new AppFlowEvent();
            f.FlowProps.Add("Message", ex.Message);
            f.FlowProps.Add("StackTrace", ex.ToString());
            FlowUtility.SaveFlow(f, flow);
        }
        public static void ExceptionAndResult(this AppFlow flow, System.Exception ex, ref AppsClient.AppsResult result)
        {
            var f = new AppFlowEvent();
            f.FlowProps.Add("Message", ex.Message);
            f.FlowProps.Add("StackTrace", ex.ToString());
            f.FlowProps.Add("Result", Newtonsoft.Json.JsonConvert.SerializeObject(result));
            FlowUtility.SaveFlow(f, flow);
        }
    }
}
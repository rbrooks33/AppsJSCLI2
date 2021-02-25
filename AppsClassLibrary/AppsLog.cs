using Microsoft.AspNetCore.SignalR.Client;
using NLog;
using System;
using System.Collections.Generic;
using System.Text;

namespace AppsClient
{
    public static class AppsLog
    {
        public static bool LogFlows { get; set; }
        private static readonly NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        private static string DomainOrAppName { get; set; }
        public static void Load(string domainOrAppName)
        {
            DomainOrAppName = domainOrAppName;

            var nConfig = new NLog.Config.LoggingConfiguration();

            var infoLogfile = new NLog.Targets.FileTarget("infoLogfile") { FileName = @"${basedir}\logs\" + domainOrAppName + @"\INFO_${date:format=yyyy-MM-dd}.log" };
            var errorLogfile = new NLog.Targets.FileTarget("errorLogfile") { FileName = @"${basedir}\logs\" + domainOrAppName + @"\ERROR_${date:format=yyyy-MM-dd}.log" };

            nConfig.AddRule(LogLevel.Info, LogLevel.Info, infoLogfile);
            nConfig.AddRule(LogLevel.Error, LogLevel.Error, errorLogfile);

            NLog.LogManager.Configuration = nConfig;

            LogInfo("Apps Logging initialized for client " + domainOrAppName);

        }
        public static void LogError(string message)
        {
            logger.Error(message);
        }

        public static void LogInfo(string message)
        {
            logger.Info(message);
        }
        //public class StepLog
        //{
        //    public string FlowAndStep { get; set; }
        //    public string Data { get; set; }
        //}
        //public static void LogStep<T>(string data = "")
        //{
        //    var newFlowStep = new StepLog();
        //    newFlowStep.FlowAndStep = typeof(T).ToString();
        //    newFlowStep.Data = data;
        //    string stepLogJson = Newtonsoft.Json.JsonConvert.SerializeObject(newFlowStep);

        //    WriteInfoToLogFile("Flow: " + typeof(T) + ". Data: " + data);

        //    if(AppsLog.LogFlows)
        //    {
        //        logger.Info(stepLogJson);
        //        AppsClientHub.Log(stepLogJson);
        //    }
        //}
        //public static void Log(AppFlow flow)
        //{

        //    string json = Newtonsoft.Json.JsonConvert.SerializeObject(flow);

        //    WriteInfoToLogFile("Flow: " + flow.GetType().ToString() + ". Data: " + json);

        //    logger.Info(json);
        //}
        //public static void LogError(Flow flow, string message, string ID = "", string IDType = "")
        //{
        //    WriteTextToLogFile("Area: " + Enum.GetName(typeof(Flow), flow) + ". Error: " + message);
        //}
        //public static void LogException(Flow flow, Exception ex, string ID = "", string IDType = "", string Sql = "")
        //{
        //    WriteTextToLogFile("Area: " + Enum.GetName(typeof(Flow), flow) + ". Exception: " + ex.ToString(), Sql);
        //}

        //public class ExceptionStep
        //{
        //    public string ID { get; set; }
        //    public string IDType { get; set; }
        //    public string Sql { get; set; }
        //    public Exception Ex { get; set; }
        //}
        //public class ErrorStep
        //{
        //    public string ID { get; set; }
        //    public string IDType { get; set; }
        //    public string Description { get; set; }
        //}
        //public class WarningStep
        //{
        //    public int ID { get; set; }
        //    public string IDType { get; set; }
        //    public string Description { get; set; }
        //}
        //public static void WriteTextToLogFile(string AdditionalInfo, string DumpQuery = "")
        //{
        //    logger.Error(AdditionalInfo);
        //}
        //public static void WriteInfoToLogFile(string AdditionalInfo)
        //{
        //    logger.Info(AdditionalInfo);
        //}
    }
}

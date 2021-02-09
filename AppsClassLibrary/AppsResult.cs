using System;
using System.Collections.Generic;
using System.Text;

namespace AppsClient
{
    public class AppsResult
    {
        public AppsResult()
        {
            Messages = new List<string>();
            SuccessMessages = new List<string>();
            FailMessages = new List<string>();
            Codes = new List<AppsResultCode>();
        }
        public bool Success { get; set; }
        public bool ShowFailMessage { get; set; }
        public string FailMessage { get; set; }
        public List<string> Messages { get; set; }
        public List<string> SuccessMessages { get; set; }
        public List<string> FailMessages { get; set; }
        public List<AppsResultCode> Codes { get; set; }
        public object Data { get; set; }
    }
    public class AppsResultCode
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }

}

using Flows;
using System;
using System.Collections.Generic;
using System.Text;

namespace Brooksoft.Apps.Client.Flows
{
    /// <summary>
    /// These are internal appflows aside from those custom flows created by client app
    /// </summary>
    public class AppFlows
    {
        public class ClientSystem : AppFlow
        {
            public string Message;
            public ClientSystem(string successMessage)
            {
                this.Message = successMessage;
                this.Color = "green";
                this.End();
                AppsClient.AppsLog.LogInfo(successMessage);
            }

            public class Fail : AppFlow
            {
                public string Message;
                public Fail(string failMessage, ref AppsClient.AppsResult result)
                {
                    Message = failMessage;
                    //base.Signal(failMessage);
                    base.Color = "orange";
                    base.End();
                    AppsClient.AppsLog.LogInfo(failMessage);
                }
            }

            public class Exception : AppFlow
            {
                public Exception(System.Exception ex, ref AppsClient.AppsResult result)
                {
                    this.Color = "red";
                    this.ExceptionAndResult(ex, ref result);
                    AppsClient.AppsLog.LogError(ex.ToString());
                }
            }

        }
    }
}

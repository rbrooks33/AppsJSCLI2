using Brooksoft.Apps.Client.Flows;
using Brooksoft.Apps.Client.Tests;
using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AppsClient
{
    public class AppsClientHub
    {
        public static HubConnection AppsHubConnection { get; set; }
        public static void Load()
        {
            var result = new AppsResult();

            try
            {
                HubConnection connection = new HubConnectionBuilder()
                       .WithUrl(AppsClientConfig.AppsURL + "/appsHub")
                       .Build();

                //connection.On<string, string>("SendAppsClientConfig", (user, message) =>
                //{

                //});

                connection.StartAsync().Wait();

                connection.Closed += async (error) =>
                {
                    await Task.Delay(new Random().Next(0, 5) * 1000);
                    connection.StartAsync().Wait();
                };

                //connection.InvokeAsync("SendMessage", this.MachineName, "AppsHub started.");

                AppsClientHub.AppsHubConnection = connection;
            }
            catch(Exception ex)
            {
                new AppFlows.ClientSystem.Exception(ex, ref result);
            }
        }

        public static void SendMessage(string name, string message)
        {
            if (AppsClientHub.AppsHubConnection != null)
                AppsClientHub.AppsHubConnection.SendAsync("SendMessage", name, message);
        }
        public static void SendConfig(AppsClientConfig config)
        {
            if(AppsClientHub.AppsHubConnection != null)
                AppsClientHub.AppsHubConnection.SendAsync(AppsHubMethods.SendAppsClientConfig.ToString(), config);
        }
        public static void SendFileChange(System.IO.FileSystemEventArgs args)
        {
            if (AppsClientHub.AppsHubConnection != null)
                AppsClientHub.AppsHubConnection.SendAsync(AppsHubMethods.SendFileChange.ToString(), args);
        }
        public static void Ping()
        {
            if (AppsClientHub.AppsHubConnection != null)
                AppsClientHub.AppsHubConnection.SendAsync(AppsHubMethods.Ping.ToString(), Environment.MachineName, Environment.CurrentDirectory);
        }
        public static void Log(string step)
        {
            if (AppsClientHub.AppsHubConnection != null)
                AppsClientHub.AppsHubConnection.SendAsync(AppsHubMethods.Log.ToString(), step);
        }
        public static void TestProgress(TestMessageStatus status, string message)
        {
            if (AppsClientHub.AppsHubConnection != null)
                AppsClientHub.AppsHubConnection.SendAsync(AppsHubMethods.TestProgress.ToString(), status.ToString(), message);
        }
    }
}

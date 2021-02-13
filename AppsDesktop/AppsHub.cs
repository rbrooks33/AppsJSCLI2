using Business;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
//using Microsoft.AspNetCore.SignalR;
//using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class AppsHub : Hub
    {
        private static string dbPath = Environment.CurrentDirectory + "\\Apps.db";

        //private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext();
        //IHubContext context = Startup.ConnectionManager.GetHubContext<ChatHub>();
        LiteDatabase AppsDB;
        AppsData _data;
        public AppsHub(AppsData data)
        {
            //  _context = context;
            AppsDB = data.AppsDB;
            _data = data;
        }

        public static void Load()
        {
            //Open signal client
            HubConnection connection = new HubConnectionBuilder().WithUrl("https://localhost:54321/appsHub").Build();

            Task startTask = connection.StartAsync();

            connection.On<string, string>("ReceivePing", (machineName, workingFolder) => {
                
            });

            connection.Closed += async (error) =>
            {
                await Task.Delay(new Random().Next(0, 5) * 1000);
                await connection.StartAsync();
            };
        }
        public async Task Log(string logJson)
        {

        }
        public async Task SendMessage(string user, string message)
        {
            //await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        /// <summary>
        /// Called whenever client starts up (Run). 
        /// 
        ///See https://github.com/rbrooks33/Brooksoft.Apps.DevOps/discussions/3
        /// 
        /// Scenarios
        /// 1.) New client (no database yet or database deleted)
        /// 
        /// 2.) Existing client (sunny day, database exists
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        public async Task SendAppsClientConfig(AppsClient.AppsClientConfig config)
        {
            var result = new AppsClient.AppsResult();

            try
            {
                AppsHelper.RegisterClient(_data, AppsDB, config, ref result);
            }
            catch (System.Exception ex)
            {
                new AppFlows.Helpers.AppsSystem.Exception(ex, ref result);
            }
        }

        public async Task Ping(string machineName, string workingFolder)
        {
            await Clients.All.SendAsync("Ping", machineName, workingFolder);
        }
    }

}

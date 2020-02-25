using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSCLI2.Models
{
    public class DesktopHub : Microsoft.AspNetCore.SignalR.Hub
    {
        //  private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext();
        //IHubContext context = Startup.ConnectionManager.GetHubContext<ChatHub>();

        public DesktopHub()
        {
            //  _context = context;
        }
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("SendMessage", user, message);
        }

    }
}

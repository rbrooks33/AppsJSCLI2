using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AppsDesktop
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    //webBuilder.UseUrls("https://localhost:5002/");
                    webBuilder.UseKestrel();
                    //webBuilder.UseIIS();
                    webBuilder.UseContentRoot(Directory.GetCurrentDirectory());
                    webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
                    {
                        config.SetBasePath(hostingContext.HostingEnvironment.ContentRootPath)
                        .AddJsonFile("appsettings.json", true, true)
                        .AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json")
                        //.AddJsonFile("Configs/ocelot.json", optional: false, reloadOnChange: true)
                        .AddEnvironmentVariables();
                    })
                    .ConfigureLogging((hostingContext, logging) =>
                    {
                        //todo
                    });
                    

                    //OpenBrowser("https://localhost:5002/index.html");

                }).ConfigureLogging(logging => {
                    logging.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Debug);
                    //logging.AddFilter("Microsoft.AspNetCore.SignalR", LogLevel.Debug);
                });
        public static void OpenBrowser(string url)
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                Process.Start("xdg-open", url);
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                Process.Start("open", url);
            }
            else
            {
                // throw 
            }
        }
    }
}

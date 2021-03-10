using System.Collections.Generic;
using AppsClient;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Serialization;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq;
using System;
using Flows;

namespace AppsDesktop
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        //readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public LiteDB.LiteDatabase AppsDB;
        //public LiteDB.LiteDatabase FlowsDB;
        public string output;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddDbContext<AppsContext>(options =>
            //options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            //Selenium Driver
            //Action<OpenQA.Selenium.Chrome.ChromeDriver> chromeDriver = (cd => { 

            //});
            services.AddSingleton<OpenQA.Selenium.Chrome.ChromeDriver>(new OpenQA.Selenium.Chrome.ChromeDriver(Environment.CurrentDirectory + "\\Libraries"));

            //Main db
            Action<AppsData> liteDBOptions = (opt =>
            {
                opt.AppsDBPath = System.Environment.CurrentDirectory + "\\Business\\Data\\Apps.db";
                opt.AppsDB = new LiteDB.LiteDatabase(opt.AppsDBPath);
            });

            ////Flows db
            //Action<FlowsData> flowDBOptions = (opt =>
            //{
            //    opt.FlowsDBPath = System.Environment.CurrentDirectory + "\\Flows.db";
            //    opt.FlowsDB = new LiteDB.LiteDatabase(opt.FlowsDBPath);
            //});

            services.Configure(liteDBOptions);
            services.AddSingleton(resolver => resolver.GetRequiredService<IOptions<AppsData>>().Value);

            //services.Configure(flowDBOptions);
            //services.AddSingleton(resolver => resolver.GetRequiredService<IOptions<FlowsData>>().Value);

            //services.AddCors(options =>
            //{
            //    options.AddPolicy(MyAllowSpecificOrigins,
            //    builder =>
            //    {
            //        builder.WithOrigins("http://localhost:52780");
            //    });
            //});
            services.AddSignalR();
            services.AddControllers();
            services.AddMvcCore().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });
            //services.AddOcelot();

            //var builder = services.AddIdentityServer()
            //    .AddDeveloperSigningCredential()        //This is for dev only scenarios when you don’t have a certificate to use.
            //    .AddInMemoryApiScopes(IdentityServerTest.Config.ApiScopes)
            //    .AddInMemoryClients(IdentityServerTest.Config.Clients);

            //// this comes from Ocelot.Tracing.Butterfly package
            //services.AddButterfly(option =>
            //{
            //    //this is the url that the butterfly collector server is running on...
            //    option.CollectorUrl = "https://localhost:9618";
            //    option.Service = "Ocelot";
            //});
            //services.AddIdentityServer()
            //    .AddDeveloperSigningCredential()
            //    //.AddInMemoryApiResources(new[] { new ApiResource("socialnetwork", "Social Network") })
            //    .AddInMemoryClients(new[] { new Client{
            //         ClientId = "socialnetwork",
            //         ClientSecrets = new [] { new Secret("secret".Sha256())},
            //         AllowedGrantTypes = GrantTypes.ResourceOwnerPasswordAndClientCredentials,
            //         AllowedScopes = new[] {"socialnetwork"}
            //        } 
            //    }).AddInMemoryApiScopes(new[] { new ApiScope("socialnetwork", "My API") });
            //.AddTestUsers(new List<IdentityServer4.Test.TestUser> { 
            //    new IdentityServer4.Test.TestUser
            //    {
            //        SubjectId = "1",
            //        Username = "rbrooks@gmail.com",
            //        Password = "password"
            //    }

            //services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
            //{
            //    options.Authority = "https://localhost:54321";
            //    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            //    {
            //        ValidateAudience = false
            //    };
            //});

            //// Add Hangfire services.
            //services.AddHangfire(configuration => configuration
            //    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
            //    .UseSimpleAssemblyNameTypeSerializer()
            //    .UseRecommendedSerializerSettings()
            //    .UseMemoryStorage());

            //// Add the processing server as IHostedService
            //services.AddHangfireServer();
            //var flowsDb = new LiteDB.LiteDatabase(System.Environment.CurrentDirectory + "\\Flows.db");
            //FlowsData.FlowTable = flowsDb.GetCollection<AppFlowEvent>("Flows");

            //var clientConfig = new AppsClientConfig();
            //clientConfig.Load("Brooksoft.Apps", Environment.MachineName, Environment.CurrentDirectory, new System.Version(0, 0, 1), new List<string>(), new List<AppsCustomConfigItem>(), true, true, new AppFlow());

            AppsLog.LogInfo("Finished configure services.");
            //var perms = new Brooksoft.Apps.Business.Publish.Permissions();
            //perms.ReadEffectivePermissions();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, AppsData appsdb)
        {
            //app.UseCors(MyAllowSpecificOrigins);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles(new DefaultFilesOptions { DefaultFileNames = new List<string> { "index.html" } });

            app.UseStaticFiles();

            //app.UseHangfireDashboard();
            
            app.UseHttpsRedirection();

            app.UseRouting();

            //app.UseAuthentication();

            //app.UseAuthorization();

            //app.addj.AddJsonOptions(options =>
            // {
            //     options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
            //     options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            // });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<AppsHub>("/appsHub");
            });

            //app.UseIdentityServer();
            //app.UseOcelot().Wait(); //Must go after id server

            AppsLog.Load("Apps"); //already done with config registration
            var hub = new AppsHub(appsdb);
            hub.Load();
            FlowsData.Load();

            //AppsHub.TestProgress("hiya");
            //var aTimer = new System.Timers.Timer(5000);
            //// Hook up the Elapsed event for the timer. 
            //aTimer.Elapsed += ATimer_Elapsed; ;
            //aTimer.AutoReset = true;
            //aTimer.Enabled = true;

            //AppsDB = appsdb.AppsDB;
            //FlowsDB = flowsdb.FlowsDB;
            //var solutionDirectory = @"D:\Work\Brooksoft\AppsJS\AppsJSDemo\AppsJSDemo\AppsJSDemo.sln";
            //var projectFilePath = @"D:\Work\Brooksoft\AppsJS\AppsJSDemo\AppsJSDemo\AppsJSDemo.csproj";

            //var globalProperties = new Dictionary<string, string> {
            //    { "DesignTimeBuild", "true" },
            //    { "BuildProjectReferences", "false" },
            //    { "_ResolveReferenceDependencies", "false" },
            //    { "SolutionDir", solutionDirectory + System.IO.Path.DirectorySeparatorChar }
            //};

            //var collection = new Microsoft.Build.Evaluation.ProjectCollection();
            //Microsoft.Build.Evaluation.Project project = collection.LoadProject(projectFilePath);

            //Run();

            //hangfireJobs.Enqueue(() => Console.WriteLine("Hello world from Hangfire!"));
            AppsLog.LogInfo("Finished configure.");
        }
        private void Run()
        {
            var args = new Dictionary<string, string> {
                 { "", "publish"},
                 
                };

            var arguments = string.Join(" ", args.Select((k) => string.Format("{0} {1}", k.Key, "\"" + k.Value + "\"")));

            var projectPath = @"D:\Work\Brooksoft\AppsJS\AppsJSDev\AppsJSDev\AppsJSDev\appsjsdev.csproj"; // @"C:\Users\xyz\Documents\Visual Studio 2017\myConsole\bin\Debug\netcoreapp2.1\myConsole.dll";
            var procStartInfo = new System.Diagnostics.ProcessStartInfo();
            procStartInfo.FileName = "dotnet";
            procStartInfo.Arguments = @$" publish {projectPath} {arguments}";
            procStartInfo.UseShellExecute = false;
            procStartInfo.CreateNoWindow = false;
            procStartInfo.RedirectStandardOutput = true;
            procStartInfo.RedirectStandardError = true;

            var sb = new System.Text.StringBuilder();
            var pr = new System.Diagnostics.Process();
            pr.StartInfo = procStartInfo;

            pr.OutputDataReceived += (s, ev) =>
            {
                if (string.IsNullOrWhiteSpace(ev.Data))
                {
                    return;
                }

                //string[] split = ev.Data.Split(new char[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                output += ev.Data.ToString();
            };

            pr.ErrorDataReceived += (s, err) =>
            {
                // do stuff here
            };

            pr.EnableRaisingEvents = true;
            pr.Start();
            pr.BeginOutputReadLine();
            pr.BeginErrorReadLine();

            pr.WaitForExit();
            
        }
        //private void ATimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        //{
        //    //var appsController = new AppsDesktop.Controllers.AppsController();
        //    CheckWorkingFolder();
        //}
        //public void CheckWorkingFolder()
        //{
        //    try
        //    {
        //        var result = new AppsResult();
        //        //var appsController = new AppsController(_db);
        //        //var appsResult = GetApps();
        //        //if (appsResult.Success)
        //        //{
        //        //using (var db = new LiteDatabase(dbPath))
        //        //{
        //        var objs = AppsDB.GetCollection<Models.Software.App>("Apps");
        //        var apps = objs.Query().Where(a => a.IsEnabled == true).ToList();

        //        foreach (var app in apps)
        //            app.WorkingFolderExists = false;

        //        foreach (var app in apps)
        //        {
        //            if (System.IO.Directory.Exists(app.WorkingFolder))
        //            {
        //                app.WorkingFolderExists = true;
        //                objs.Update(app);
        //            }
        //            //}
        //            //}
        //        }
        //        //}
        //    }
        //    catch (System.Exception ex)
        //    {
        //        AppsLog.LogStep<Flows.Systemx.Exception>(ex.ToString());
        //    }
        //}

        //public static IEnumerable<Client> Clients =>
        //    new List<Client>
        //    {
        //        new Client
        //        {
        //            ClientId = "client",

        //            // no interactive user, use the clientid/secret for authentication
        //            AllowedGrantTypes = GrantTypes.ClientCredentials,

        //            // secret for authentication
        //            ClientSecrets =
        //            {
        //                new Secret("secret".Sha256())
        //            },

        //            // scopes that client has access to
        //            AllowedScopes = { "api1" }
        //        }
        //    };
    }
}

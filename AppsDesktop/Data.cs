using System.Linq;
using System.Collections.Generic;

namespace AppsDesktop
{
    
    public class AppsData
    {
        public AppsData()
        {
            ClientAppsDBs = new List<ClientAppsDB>();
        }
        public string AppsDBPath { get; set; }
        public LiteDB.LiteDatabase AppsDB { get; set; }
        public List<ClientAppsDB> ClientAppsDBs { get; set; }
        public class ClientAppsDB
        {
            public App App { get; set; }
            public LiteDB.LiteDatabase AppsDB { get; set; }
        }
        /// <summary>
        /// Saves existing or new instance of the app's local db in local collection of dbs
        /// </summary>
        /// <param name="app"></param>
        /// <param name="result"></param>
        public void UpsertAppDB(App app, ref AppsClient.AppsResult result)
        {
            var existingDbs = this.ClientAppsDBs.Where(cdb => cdb.App.MachineName == app.MachineName && cdb.App.WorkingFolder == app.WorkingFolder);
            if (existingDbs.Count() == 0)
            {
                //Create
                var newClientDB = new AppsData.ClientAppsDB();
                newClientDB.AppsDB = new LiteDB.LiteDatabase(app.WorkingFolder + "\\AppsClient.db");
                newClientDB.App = app;
                this.ClientAppsDBs.Add(newClientDB);
            }
            else if (existingDbs.Count() == 1)
            {
                //Update (reload app db since could have gone and come back. We want to keep the history)
                var existingDb = existingDbs.Single();
                existingDb.AppsDB = new LiteDB.LiteDatabase(app.WorkingFolder + "\\AppsClient.db");
                existingDbs.Single().App = app;

            }
            else if(existingDbs.Count() > 1)
            {
                new AppFlows.Helpers.AppsSystem.Fail("Found an app with two instances of same folder and machine: " + app.AppID.ToString(), ref result);
            }
        }
    }
  
    //public class AppsContext : DbContext
    //{
    //    public AppsContext() : base()
    //    {

    //    }

    //    public AppsContext(DbContextOptions options)
    //        : base(options)
    //    {

    //    }

    //    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //    {
    //        //optionsBuilder..UseInMemoryDatabase("Company");
    //        //optionsBuilder.UseNpgsql()
    //    }

    //}
}

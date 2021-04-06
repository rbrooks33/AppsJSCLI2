using AppsDesktop;
using Microsoft.Win32.SafeHandles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace Brooksoft.Apps.Business
{
    public class Client : IDisposable
    {
        // To detect redundant calls
        private bool _disposed = false;

        ~Client() => Dispose(false);

        // Public implementation of Dispose pattern callable by consumers.
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        public Client(int appId, LiteDB.LiteDatabase appsDb, ref AppsClient.AppsResult result)
        {


        var appsTable = appsDb.GetCollection<App>("Apps");
            var appsList = appsTable.Query().Where(app => app.AppID == appId);
            if (appsList.Count() == 1)
            {
                PopulateClient(appsList.Single());
            }
            else
                new AppFlows.Helpers.AppsSystem.Fail("Number of apps for appid not one: " + appsList.Count().ToString(), ref result);
        }
        public Client(App app, ref AppsClient.AppsResult result)
        {
            PopulateClient(app);
        }
        public Client(string machineName, string workingFolder, LiteDB.LiteDatabase appsDb, ref AppsClient.AppsResult result)
        {
            var appsTable = appsDb.GetCollection<App>("Apps");
            var appsList = appsTable.Query().Where(app => app.MachineName == machineName && app.WorkingFolder == workingFolder);
            if (appsList.Count() == 1)
            {
                PopulateClient(appsList.Single());
            }
            else
                new AppFlows.Helpers.AppsSystem.Fail("Number of apps for appid not one: " + appsList.Count().ToString(), ref result);
        }
        public App App { get; set; }
        public LiteDB.LiteDatabase DB { get; set; }

        private void PopulateClient(App app)
        {
            this.App = app;
            this.DB = new LiteDB.LiteDatabase(this.App.WorkingFolder + "AppsClient.db");
        }

        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
            {
                return;
            }

            if (disposing)
            {
                // TODO: dispose managed state (managed objects).
            }

            // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
            // TODO: set large fields to null.

            _disposed = true;
        }
    }
}

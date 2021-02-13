using System;
using Xunit;

namespace Brooksoft.Apps.Test
{
    public class Client_Should
    {
        [Fact]
        public void GetANewDatabaseOnFirstRegistration()
        {
            var appsData = new Moq.Mock<AppsDesktop.AppsData>(Moq.MockBehavior.Strict);
            var db = new Moq.Mock<LiteDB.LiteDatabase>(Moq.MockBehavior.Strict);

            var config = new AppsClient.AppsClientConfig();
            var result = new AppsClient.AppsResult();

            //Business.AppsHelper.RegisterClient(appsData.Object, db.Object, config, ref result);
        }
    }
}

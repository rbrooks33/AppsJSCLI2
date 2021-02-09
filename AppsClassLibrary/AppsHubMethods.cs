using System;
using System.Collections.Generic;
using System.Text;

namespace AppsClient
{
    public enum AppsHubMethods
    {
        SendMessage = 1,
        SendAppsClientConfig = 2,
        SendFileChange = 3,
        Ping = 4,
        Log = 5
    }
}

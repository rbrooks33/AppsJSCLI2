using System;
using System.Collections.Generic;
using System.Text;

namespace AppsClient
{
    public interface IAppsCustomConfig
    {
        string[] Load(string logFileName, ref AppsResult result);
        string GetConfigValue(string[] lines, string propertyName);
        bool GetBoolConfigValue(string[] lines, string propertyName);
        List<AppsCustomConfigItem> CustomConfigItems { get; set; } 
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace AppsClient
{
    public interface IAppsClientConfig
    {
        string MachineName { get; set; }
        string WorkingDirectory { get; set; }
        System.Version VersionNumber { get; set; }
        List<string> Services { get; set; }
        List<AppsCustomConfigItem> CustomConfigs { get; set; }
        Flows.AppFlow Flows { get; set; }
        void Load(string projectName, string machineName, string workingDirectory, System.Version versionNumber, List<string> services, List<AppsCustomConfigItem> customConfigs, bool loadFlows, bool logFlows, Flows.AppFlow flows);
    }
}

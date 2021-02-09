using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace AppsClient
{
    public class AppsCustomConfig : IAppsCustomConfig
    {
        public List<AppsCustomConfigItem> CustomConfigItems { get; set; }

        public virtual string[] Load(string configFileName, ref AppsResult result)
        {
            string[] lines = null;
            string machineName = Environment.MachineName;
            string configPath = @"\MyConfig\" + configFileName;

            string configDefaultDrivePath = "D:";
            string configAlternateDrivePath = "C:";
            string configAlternateDrivePathG = "G:";

            string defaultPath = configDefaultDrivePath + configPath;
            string alternatConfigPath = configAlternateDrivePath + configPath;
            string altG = configAlternateDrivePathG + configPath;
            string usingConfigPath = "";

            if (File.Exists(defaultPath))
                usingConfigPath = defaultPath;
            else if (File.Exists(alternatConfigPath))
                usingConfigPath = alternatConfigPath;
            else if (File.Exists(altG))
                usingConfigPath = altG;

            if (File.Exists(usingConfigPath))
            {
                lines = File.ReadAllLines(usingConfigPath);

                // create config here:
            }
            else
            {
                //AppsLog.LogError( AppsLog.Flow.Config, "Missing default and alternate configuration file paths.");
            }
            return lines;
        }
        public virtual string GetConfigValue(string[] lines, string propertyName)
        {
            string result = "";
            char[] pipe = { '|' };
            string[] matches = lines.Where(l => l.Contains("|") && l.Split('|').Length == 2 && l.Split(pipe)[0] == propertyName).ToArray();
            if (matches.Length == 1)
                result = matches[0].Split('|')[1];
            else
            {
             //   AppsLog.LogError(AppsLog.Flow.Config, "A config value is missing." + propertyName);
            }
            return result;
        }

        public virtual bool GetBoolConfigValue(string[] lines, string propertyName)
        {
            bool result = false;
            string value = GetConfigValue(lines, propertyName);
            bool.TryParse(value, out result);
            return result;
        }

    }
}

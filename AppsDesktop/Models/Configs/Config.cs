using AppsClient;
using AppsDesktop.Models.Configs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AppsDesktop.Models
{
    public class Config
    {
        //public static string CONFIG_PATH = Environment.CurrentDirectory + "\\Configs\\config.json";
        //public static string FOUND_DIRECTORIES_PATH = 
        private static Config _Config;
        public string BaseWebRootFolder { get; set; }
        public string BaseAppsFolder { get; set; }
        public string BaseComponentsFolder { get; set; }
        public string BaseComponentsFilePath { get; set; }
        public string BaseResourcesFolder { get; set; }
        public string BaseResourcesFilePath { get; set; }
        //public string BaseTemplatesFolder { get; set; }
        public string FoundDirectoriesPath { get; set; }
        public List<ValidationStep> ValidationSteps { get; set; }
        public static bool IsValid
        {
            get
            {
                bool valid = false;
                if (Config.CurrentConfig != null)
                {
                    if (Config.CurrentConfig.ValidationSteps.Count() > 0 
                        && Config.CurrentConfig.ValidationSteps.All(s => s.Passed))
                    {
                        valid = true;
                    }
                }
                return valid;
            }
        }
        public Config()
        {
            FoundDirectoriesPath = Environment.CurrentDirectory + "\\Configs\\founddirectories.json";
            ValidationSteps = new List<ValidationStep>();
        }

        public static Config CurrentConfig
        {
            get
            {
                if (_Config == null)
                {
                    _Config = LoadConfig();
                }
                return _Config;
            }
        }
        public static Config LoadConfig()
        {
            var result = new Config();
            _Config = result;
            //using (StreamReader r = new StreamReader(CONFIG_PATH))
            //{
            //    var json = r.ReadToEnd();
            //    result = JsonConvert.DeserializeObject<Config>(json);
            //    _Config = result;
            //}
            return result;
        }
        public static ComponentReport LoadComponentsConfig()
        {
            var result = new ComponentReport();
            if (Config.IsValid)
            {
                using (StreamReader r = new StreamReader(Config.CurrentConfig.BaseComponentsFilePath))
                {
                    var json = r.ReadToEnd();
                    result = JsonConvert.DeserializeObject<ComponentReport>(json);
                }
            }
            return result;
        }
        public static void SaveComponentsConfig(ComponentReport components)
        {
            if (Config.IsValid)
            {
                using (StreamWriter w = new StreamWriter(Config.CurrentConfig.BaseComponentsFilePath))
                {
                    w.Write(JsonConvert.SerializeObject(components));
                }
            }
        }

        public static void LoadFoundDirectoriesConfig(ref AppsResult result)
        {
            //var fd = new FoundDirectories();

            //if (Config.IsValid) //Never dependent on config as is called outside of project
            //{
            string path = new Config().FoundDirectoriesPath; //Shouldn't renew singleton

            result.Messages.Add("Got path to found directories: " + path);

            using (StreamReader r = new StreamReader(path))
            {
                var json = r.ReadToEnd();
                FoundDirectories dirs = JsonConvert.DeserializeObject<FoundDirectories>(json);

                result.Messages.Add("Got directories: " + dirs.Directories.Count().ToString());
                result.Data = dirs;
            }
            //}
            //return result;
        }
        public static void SaveFoundDirectoriesConfig(FoundDirectories directories)
        {
            string path = new Config().FoundDirectoriesPath;

            using (StreamWriter w = new StreamWriter(path))
            {
                w.Write(JsonConvert.SerializeObject(directories));
            }
        }
    }
    //public class ConfigFolder
    //{
    //    public string Path { get; set; }
    //    public string Description { get; set; }
    //}
}

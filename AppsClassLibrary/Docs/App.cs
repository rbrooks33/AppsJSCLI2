using Flows;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class App
    {
        public App()
        {
            Stories = new List<SoftwareStory>();
            SoftwareFiles = new List<SoftwareFile>();
            PublishProfiles = new List<PublishProfile>();
        }
        [Key]
        public int AppID { get; set; }
        public string AppName { get; set; }
        public string MachineName { get; set; }
        public string WorkingFolder { get; set; }
        //public string WorkingFolder { 
        //    get {
        //        return WorkingFolder;
        //    } 
        //    set {
        //        this.WorkingFolder = value;
        //        if (System.IO.Directory.Exists(this.WorkingFolder))
        //            this.WorkingFolderExists = true;
        //    } 
        //}
        public string ProjectFileFullName { get; set; }
        public bool ProjectFileExists { get; set; }
        public bool WorkingFolderExists { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsAppsJSExists { get; set; }
        public int SystemID { get; set; }
        public bool Archived { get; set; }
        public SoftwareTypes SoftwareType { get; set; }
        public string LocalHostPort { get; set; }
        public List<SoftwareStory> Stories { get; set; }
        public List<SoftwareFile> SoftwareFiles { get; set; }
        public List<PublishProfile> PublishProfiles { get; set; }
    }
}

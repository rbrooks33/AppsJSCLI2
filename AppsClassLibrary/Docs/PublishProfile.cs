using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class PublishProfile
    {
        [Key]
        public int PublishProfileID { get; set; }
        public int AppID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ProjectFilePath { get; set; }
        public string DestinationFolderPath { get; set; }
        public string PreBuildScript { get; set; }
        public bool RunPreBuildScript { get; set; }
        public string PostBuildScript { get; set; }
        public bool RunPostBuildScript { get; set; }
        public string LocalRepoPath { get; set; }
        public bool LocalRepoPathExists { get; set; }
        public string RemoteRepoURL { get; set; }
    }
}

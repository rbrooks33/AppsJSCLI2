using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Models.Docs
{
    public class DocFile
    {
        public enum EDisplayType
        {
            Link = 1,
            FullSize = 2,
            Thumbnail = 3
        }
        public enum EViewerType
        {
            Image = 1,
            Video = 2,
            PDF = 3
        }
        public DocFile()
        {
            Created = DateTime.Now;
        }
        [Key]
        public long DocFileID { get; set; }
        public long DocID { get; set; }
        public string FriendlyName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Extension { get; set; }
        public bool FileExists { get; set; }
        public long Size { get; set; }
        public EDisplayType DisplayType { get; set; }
        public EViewerType ViewerType { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public bool Archived { get; set; }
    }
}

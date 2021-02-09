using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1.Models.Vitacost
{
    public class Config
    {
        [Key]
        public int configID { get; set; }
        public string appName { get; set; }
        public string fieldName { get; set; }
        public string fieldValue { get; set; }
        public string description { get; set; }
        public bool active { get; set; }
        public DateTime dateLastModified { get; set; }
        public string dateLastModifiedWho { get; set; }
    }
}

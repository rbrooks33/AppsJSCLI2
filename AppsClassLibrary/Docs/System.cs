using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Models.Software
{
    public class System
    {
        public System()
        {
            Apps = new List<App>();
        }
        [Key]
        public int SystemID { get; set; }
        public string SystemName { get; set; }
        public bool IsEnabled { get; set; }
        public List<App> Apps { get; set; }
    }
}

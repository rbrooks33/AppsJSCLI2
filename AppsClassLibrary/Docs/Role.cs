using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class Role
    {
        [Key]
        public int RoleID { get; set; }
        public int AppID { get; set; }
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
    }
}

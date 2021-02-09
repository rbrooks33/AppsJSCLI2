using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1.Models.Vitacost
{
    public class Error
    {
        [Key]
        public long ErrorLogID { get; set; }
        public DateTime ErrorDateTime { get; set; }
        public string ErrorSource { get; set; }
        public string Message { get; set; }
        public string PageName { get; set; }
        public string Http_Cookie { get; set; }
        public string CallingStack { get; set; }
        public string ServerName { get; set; }
    }
}

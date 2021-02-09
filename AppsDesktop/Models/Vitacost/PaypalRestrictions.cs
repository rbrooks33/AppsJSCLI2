using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1.Models.Vitacost
{
    public class PaypalRestriction
    {
        [Key]
        public long number { get; set; }
        public string ProductExceptionType { get; set; }
        public string SKUNumber { get; set; }
        public string Country { get; set; }
        public int CountOfOtherProductExceptions { get; set; }
        public long ProductExceptionTypeID { get; set; }
    }
}

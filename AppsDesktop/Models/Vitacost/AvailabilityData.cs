using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1.Models.Vitacost
{
    public class AvailabilityDatum
    {
        [Key]
        //public long number { get; set; }
        public string Data { get; set; }
    }
    public class AvailabilityDatumExtended
    {
        [Key]
        //public long number { get; set; }
        public string Whs { get; set; }
        public decimal AvailableInv { get; set; }
        public string ItemStatus { get; set; }
        public int MinimumQtyToBuy { get; set; }
        public bool LimitedAvailability { get; set; }
        public int AvailabilityID { get; set; }
        public bool LimitedProductAssortment { get; set; }
    }
}

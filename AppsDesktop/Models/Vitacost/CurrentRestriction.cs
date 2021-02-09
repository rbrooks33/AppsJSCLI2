using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1.Models.Vitacost
{
    public class CurrentRestriction
    {
        [Key]
        public long number { get; set; }
        public int StoreID { get; set; }
        public long ProductID { get; set; }
        public string SKUNumber { get; set; }
        public decimal Available_NC { get; set; }
        public decimal Available_NV { get; set; }
        public decimal Available_MZ { get; set; }
        [NotMapped]
        public decimal? Available_NC2 { get; set; }
        [NotMapped]
        public string NC2_AvailID { get; set; }
        [NotMapped]
        public string NC2_LimitedAssortment { get; set; }
        [NotMapped]
        public decimal? Available_NV2 { get; set; }
        [NotMapped]
        public string NV2_AvailID { get; set; }
        [NotMapped]
        public string NV2_LimitedAssortment { get; set; }
        [NotMapped]
        public decimal? Available_MZ2 { get; set; }
        [NotMapped]
        public string MZ2_AvailID { get; set; }
        [NotMapped]
        public string MZ2_LimitedAssortment { get; set; }
        public int MaximumQtyToBuy { get; set; }
        public string STATUS { get; set; }
        public bool LimitedAvailability { get; set; }
        [NotMapped]
        public string LimitedAvailability2 { get; set; }
        public int Can_Bounce { get; set; }
        [NotMapped]
        public string Message { get; set; }
        [NotMapped]
        public string InStock { get; set; }
    }
}

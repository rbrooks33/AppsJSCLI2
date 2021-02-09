using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1.Models
{
    public class Product
    {
        [Key]
        public long ProductID { get; set; }
        public string SKUNumber { get; set; }
    }
    public class ProductAvailableInventory
    {
        [Key]
        public long ProductID { get; set; }
        public int StoreID { get; set; }
        public string SKUNumber { get; set; }
        public decimal AvailableInv_NC { get; set; }
        public decimal AvailableInv_NV { get; set; }
        public decimal AvailableInv_MZ { get; set; }
        public int MaximumQtyToBuy { get; set; }
        public string STATUS { get; set; }
        public bool LimitedAvailability { get; set; }
        public int Can_Bounce { get; set; }
    }
}

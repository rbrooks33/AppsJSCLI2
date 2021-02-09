using ASPNETCore1.Models;
using ASPNETCore1.Models.Vitacost;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore1
{
    public class VitacostContext : DbContext
    {
        
        public enum EVitacostEnvironment
        {
            Development = 1,
            QA = 2,
            Production = 3
        }

        public EVitacostEnvironment VitacostEnvironment { get; set; }

        public VitacostContext(EVitacostEnvironment env) : base()
        {
            this.VitacostEnvironment = env;
        }

        public VitacostContext() : base() {
            this.VitacostEnvironment = EVitacostEnvironment.Development;
        }

        public VitacostContext(DbContextOptions options)
            : base(options)
        {
           
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //if(this.VitacostEnvironment == EVitacostEnvironment.Development)
            //    optionsBuilder.UseSqlServer("Server=FLDCBOdevSQL01;Database=NaturesWealth;Trusted_Connection=True;");
            //else if(this.VitacostEnvironment == EVitacostEnvironment.QA)
            //    optionsBuilder.UseSqlServer("Server=FLDCBOqaSQL01;Database=NaturesWealth;Trusted_Connection=True;");
            //else if (this.VitacostEnvironment == EVitacostEnvironment.Production)
            //    optionsBuilder.UseSqlServer("Server=FLDCMDW01;Database=NaturesWealth;Trusted_Connection=True;");
        }

        //public DbSet<Customer> Customers { get; set; }
        public DbSet<Models.ProductAvailableInventory> InventoryExperience { get; set; }
        public DbSet<Models.Vitacost.Error> Errors { get; set; }
        public DbSet<Models.Vitacost.Template> Templates { get; set; }
        public DbSet<Models.Vitacost.TemplateName> TemplateNames { get; set; }
        public DbSet<Models.Vitacost.Config> Configs { get; set; }
        public DbSet<Models.Vitacost.PaypalRestriction> PaypalRestrictions { get; set; }
        public DbSet<Models.Vitacost.CurrentRestriction> CurrentRestrictions { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<AvailabilityDatum> AvailabilityData { get; set; }
        public DbSet<AvailabilityDatumExtended> AvailabilityDatumExtendeds { get; set; } 
    }
}

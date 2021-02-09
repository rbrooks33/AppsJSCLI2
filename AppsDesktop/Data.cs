using Microsoft.EntityFrameworkCore;

namespace AppsDesktop
{
    public class AppsData
    {
        public string AppsDBPath { get; set; }
        public LiteDB.LiteDatabase AppsDB { get; set; }
    }
  
    //public class AppsContext : DbContext
    //{
    //    public AppsContext() : base()
    //    {

    //    }

    //    public AppsContext(DbContextOptions options)
    //        : base(options)
    //    {

    //    }

    //    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //    {
    //        //optionsBuilder..UseInMemoryDatabase("Company");
    //        //optionsBuilder.UseNpgsql()
    //    }

    //}
}

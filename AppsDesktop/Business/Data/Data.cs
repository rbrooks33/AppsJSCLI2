using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AppsDesktop
{

    public class AppsData
    {
        public string AppsDBPath { get; set; }
        public LiteDB.LiteDatabase AppsDB { get; set; }
    }

    public class AppsContext : DbContext
    {
        public AppsContext() : base()
        {

        }

        public AppsContext(DbContextOptions options)
            : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=MyDatabase.db");
            //optionsBuilder..UseInMemoryDatabase("Company");
            //optionsBuilder.UseNpgsql()
        }

    }
    public class Employee
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
    }
}

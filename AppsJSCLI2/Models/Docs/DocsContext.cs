using AppsJSDev.Models.Docs;
using Microsoft.EntityFrameworkCore;

namespace AppsJSDev.Models.AppsJS
{
    public class DocsContext : DbContext
    {
        public DocsContext() : base() {

        }

        public DocsContext(DbContextOptions options)
            : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer("Server=tcp:keepworking.database.windows.net,1433;Initial Catalog=keepworking;Persist Security Info=False;User ID=rbrooks33;Password=New2metwelve;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            //optionsBuilder.UseInMemoryDatabase("AppsJSDB");
        }

        public DbSet<Doc> Docs { get; set; }
    }
}

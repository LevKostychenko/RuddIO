using Microsoft.EntityFrameworkCore;
using System.Reflection;
using RuddIO.Server.SDK.Models;

namespace RuddIO.Server.DB
{
    public class RuddIODbContext : DbContext
    {
        public RuddIODbContext()
        {
        }

        public RuddIODbContext(DbContextOptions<RuddIODbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            _ = modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}

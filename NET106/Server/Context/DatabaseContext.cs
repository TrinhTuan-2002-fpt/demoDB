using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NET106.Shared.Models;

namespace NET106.Server.Context
{
    public class DatabaseContext : IdentityDbContext<Account>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
    
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
    
            builder.Entity<School>().HasKey(c => c.Id);
            builder.Entity<Branch>().HasKey(c => c.Id);
            builder.Entity<Subjects>().HasKey(c => c.Id);
            builder.Entity<Students>().HasKey(c => c.Id);
            builder.Entity<Class>().HasKey(c => c.Id);
    
            builder.Entity<Branch>().HasOne<School>(c => c.School).
                WithMany(c => c.Branche).HasForeignKey(c => c.SchoolId);
            builder.Entity<Subjects>().HasOne<School>(c => c.School).
                WithMany(c => c.Subject).HasForeignKey(c => c.SchoolId);
            builder.Entity<Class>().HasOne<School>(c => c.School).
                WithMany(c => c.Class).HasForeignKey(c => c.SchoolId);
    
            builder.Entity<Students>().HasOne<Class>(c => c.Class).
                WithMany(c => c.Student).HasForeignKey(c => c.ClassId);
            builder.Entity<Students>().HasOne<Branch>(c => c.Branch).
                WithMany(c => c.Student).HasForeignKey(c => c.BranchId);
    
            builder.Entity<StudentSubject>().HasOne<Students>(c => c.Student).
                WithMany(c => c.StudentSubject).HasForeignKey(c => c.StudentId);
            builder.Entity<StudentSubject>().HasOne<Subjects>(c => c.Subject).
                WithMany(c => c.StudentSubject).HasForeignKey(c => c.SubjectId);
        }
    
        public DbSet<School> Schools { get; set; }
        public DbSet<Branch> Branchs { get; set; }
        public DbSet<Subjects> Subjects { get; set; }
        public DbSet<Students> Students { get; set; }
        public DbSet<Class> Classs { get; set; }
        public DbSet<StudentSubject> StudentSubject { get; set; }
    }
}

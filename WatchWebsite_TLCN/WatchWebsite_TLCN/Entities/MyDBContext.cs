using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Entities
{
    public class MyDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User_Role> User_Roles { get; set; }
        public DbSet<Energy> Enegies { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<WaterResistance> WaterResistances { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<Rate> Rates { get; set; }
        public DbSet<SubImage> SubImages { get; set; }
        public DbSet<UserTracking> UserTrackings { get; set; }


        public MyDBContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //User_Role set 2 Primary Key
            modelBuilder.Entity<User_Role>().HasKey(u => new
            {
                u.UserId,
                u.RoleId
            });

            modelBuilder.Entity<User_Role>()
                .HasOne(u => u.User)
                .WithMany(u => u.UserRole)
                .HasForeignKey(u => u.UserId);

            modelBuilder.Entity<User_Role>()
                .HasOne(u => u.Role)
                .WithMany(x => x.User_Role)
                .HasForeignKey(x => x.RoleId);

            //OrderDetail set 2 Primary Key
            modelBuilder.Entity<OrderDetail>().HasKey(u => new
            {
                u.OrderId,
                u.ProductId
            });

            //Cart set 2 Primary Key
            modelBuilder.Entity<Cart>().HasKey(u => new
            {
                u.UserId,
                u.ProductId
            });

            /*'FK_ReplyComment_User_UserRepId' on table 'ReplyComment' may cause cycles or multiple cascade paths.
             * Specify ON DELETE NO ACTION or ON UPDATE NO ACTION, or modify other FOREIGN KEY constraints.*/

/*            modelBuilder.Entity<ReplyComment>()
            .HasOne(e => e.UserId)
            .WithMany(c => c.ReplyComments)
            .OnDelete(DeleteBehavior.Cascade);*/

            //Username, email is unique
            modelBuilder.Entity<User>().HasIndex(u => new { u.Username, u.Email})
            .IsUnique(true);

            //BrandName is unique
            modelBuilder.Entity<Brand>().HasIndex(u => new { u.Name })
            .IsUnique(true);

            //MaterialValue is unique
            modelBuilder.Entity<Material>().HasIndex(u => new { u.MaterialValue })
            .IsUnique(true);

            //EnergyValue is unique
            modelBuilder.Entity<Energy>().HasIndex(u => new { u.EnergyValue })
            .IsUnique(true);

            //SizeValue is unique
            modelBuilder.Entity<Size>().HasIndex(u => new { u.SizeValue })
            .IsUnique(true);

            //WarterResistance Value is unique
            modelBuilder.Entity<WaterResistance>().HasIndex(u => new { u.WaterValue })
            .IsUnique(true);

            //Name of Product is unique
            modelBuilder.Entity<Product>().HasIndex(u => new { u.Name })
            .IsUnique(true);

            modelBuilder.Entity<Voucher>().HasIndex(u => new { u.Code })
            .IsUnique(true);

            modelBuilder.Entity<Rate>().HasKey(u => new
            {
                u.UserId,
                u.ProductId
            });

            modelBuilder.Entity<Rate>()
                .HasOne(u => u.User)
                .WithMany(u => u.Rates)
                .HasForeignKey(u => u.UserId);

            modelBuilder.Entity<Rate>()
                .HasOne(u => u.Product)
                .WithMany(x => x.Rates)
                .HasForeignKey(x => x.ProductId);

            modelBuilder.Entity<SubImage>().HasKey(u => new { u.Id});

            //Cart set 2 Primary Key
            modelBuilder.Entity<UserTracking>().HasKey(u => new
            {
                u.Cookie,
                u.ProductId
            });
        }
       

    }
}

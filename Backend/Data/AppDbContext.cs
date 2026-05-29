using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    // Constructor — receives the connection string config from Program.cs
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // DbSet<User> = the Users table
    // db.Users = SELECT * FROM Users (roughly)
    // Adding more tables later is as simple as adding more DbSet lines
    public DbSet<User> Users { get; set; }
}

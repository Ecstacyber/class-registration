using System.Reflection;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;
using ClassRegistration.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ClassRegistration.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<TodoList> TodoLists => Set<TodoList>();
    public DbSet<TodoItem> TodoItems => Set<TodoItem>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Class> Classes => Set<Class>();
    public DbSet<UserClass> UserClasses => Set<UserClass>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}

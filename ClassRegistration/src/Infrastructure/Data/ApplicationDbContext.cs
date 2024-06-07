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
    public DbSet<ClassType> ClassTypes => Set<ClassType>();
    public DbSet<UserClass> UserClasses => Set<UserClass>();
    public DbSet<RegistrationRecord> RegistrationRecords => Set<RegistrationRecord>();
    public DbSet<RegistrationSchedule> RegistrationSchedules => Set<RegistrationSchedule>();
    public DbSet<Semester> Semesters => Set<Semester>();
    public DbSet<TuitionFee> TuitionFees => Set<TuitionFee>();
    public DbSet<PrerequisiteCourse> PrerequisiteCourses => Set<PrerequisiteCourse>();
    public DbSet<User> Humans => Set<User>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        builder.Entity<PrerequisiteCourse>(entity =>
        {
            entity.HasOne(x => x.Course)
                .WithMany(x => x.Current)
                .HasForeignKey(x => x.CourseId)
                .HasConstraintName("FK_PrerequisiteCourse_CourseId");

            entity.HasOne(x => x.Prerequisite)
                .WithMany(x => x.Prerequisites)
                .HasForeignKey(x => x.PrerequisiteCourseId)
                .HasConstraintName("FK_PrerequisiteCourse_PrerequisiteCourseId");
        });

        builder.Entity<User>().Ignore(x => x.Roles);
    }
}

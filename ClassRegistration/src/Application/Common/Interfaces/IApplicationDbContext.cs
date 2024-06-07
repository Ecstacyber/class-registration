using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }
    DbSet<TodoItem> TodoItems { get; }
    DbSet<Department> Departments { get; }
    DbSet<Course> Courses { get; }
    DbSet<Class> Classes { get; }
    DbSet<ClassType> ClassTypes { get; }
    DbSet<RegistrationRecord> RegistrationRecords { get; }
    DbSet<RegistrationSchedule> RegistrationSchedules { get; }
    DbSet<Semester> Semesters { get; }
    DbSet<TuitionFee> TuitionFees { get; }
    DbSet<UserClass> UserClasses { get; }
    DbSet<PrerequisiteCourse> PrerequisiteCourses { get; }
    DbSet<User> Humans { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }
    DbSet<TodoItem> TodoItems { get; }
    DbSet<Department> Departments { get; }
    DbSet<Course> Courses { get; }
    DbSet<Class> Classes { get; }
    DbSet<Semester> Semesters { get; }
    DbSet<TuitionFee> TuitionFees { get; }
    DbSet<UserClass> UserClasses { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

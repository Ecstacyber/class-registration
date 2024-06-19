using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Courses.Queries.GetCoursesFK;

public record GetCoursesFKQuery : IRequest<IEnumerable<CoursesFKDto>>
{
}

public class GetPrerequisiteCoursesFKQueryValidator : AbstractValidator<GetCoursesFKQuery>
{
    public GetPrerequisiteCoursesFKQueryValidator()
    {
    }
}

public class GetPrerequisiteCoursesFKQueryHandler : IRequestHandler<GetCoursesFKQuery, IEnumerable<CoursesFKDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPrerequisiteCoursesFKQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CoursesFKDto>> Handle(GetCoursesFKQuery request, CancellationToken cancellationToken)
    {
        return await _context.Courses
            .Include(x => x.Department)
            .Select(x => new CoursesFKDto
            {
                PrerequisiteCourseId = x.Id,
                CourseName = x.CourseCode + " - " + x.CourseName,
                Description = x.Description,
                Department = x.Department
            })
            .ToListAsync(cancellationToken);
    }
}

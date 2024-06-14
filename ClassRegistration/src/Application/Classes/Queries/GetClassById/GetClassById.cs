using ClassRegistration.Application.Classes.Queries.GetClasses;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.RegistrationSchedules.Queries.GetCurrentRegistrationSchedule;

namespace ClassRegistration.Application.Classes.Queries.GetClassById;

public record GetClassByIdQuery : IRequest<ClassResult?>
{
    public int ClassId { get; set; }
}

public class GetClassByIdQueryValidator : AbstractValidator<GetClassByIdQuery>
{
    public GetClassByIdQueryValidator()
    {
    }
}

public class GetClassByIdQueryHandler : IRequestHandler<GetClassByIdQuery, ClassResult?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClassByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ClassResult?> Handle(GetClassByIdQuery request, CancellationToken cancellationToken)
    {
        var currentClass = await _context.Classes
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.ClassId, cancellationToken);

        ClassResult result = new ClassResult();
        if (currentClass != null)
        {
            result = _mapper.Map<ClassResult>(currentClass);
            var course = await _context.Courses.AsNoTracking().FirstOrDefaultAsync(x => x.Id == result.CourseId, cancellationToken);
            if (course != null)
            {
                result.Course = course;
                var department = await _context.Departments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == course.DepartmentId, cancellationToken);
                if (department != null)
                {
                    if (result.Course != null)
                    {
                        result.DepartmentName = department.FullName;
                        result.Course.Department = department;
                    }                  
                }
            }
        }
        else
        {
            return null;
        }
                
        return result;
    }
}

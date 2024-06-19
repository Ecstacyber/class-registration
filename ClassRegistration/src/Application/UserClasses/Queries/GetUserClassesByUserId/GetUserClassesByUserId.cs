using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Departments.Queries.GetDepartments;

namespace ClassRegistration.Application.UserClasses.Queries.GetUserClassesByUserId;

public record GetUserClassesByUserIdQuery : IRequest<UserClassDto>
{
    public int UserId { get; set; }
}

public class GetUserClassesByUserIdQueryValidator : AbstractValidator<GetUserClassesByUserIdQuery>
{
    public GetUserClassesByUserIdQueryValidator()
    {
    }
}

public class GetUserClassesByUserIdQueryHandler : IRequestHandler<GetUserClassesByUserIdQuery, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUserClassesByUserIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UserClassDto> Handle(GetUserClassesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var userClasses = _context.UserClasses
            .AsNoTracking()
            .Include(x => x.Class)
            .Include(x => x.RegistrationSchedule)
            .Where(x => x.UserId == request.UserId);

        var result = await userClasses
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        foreach (var userClass in result)
        {
            var currentClass = await _context.Classes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userClass.ClassId, cancellationToken);
            if (currentClass != null)
            {
                var type = await _context.ClassTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == currentClass.ClassTypeId, cancellationToken);
                if (type != null)
                {
                    userClass.ClassType = type.Type;
                }
                var currentCourse = await _context.Courses.AsNoTracking().FirstOrDefaultAsync(x => x.Id == currentClass.CourseId, cancellationToken);
                if (currentCourse != null)
                {
                    userClass.CourseName = currentCourse.CourseName;
                    var department = await _context.Departments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == currentCourse.DepartmentId, cancellationToken);
                    if (department != null)
                    {
                        userClass.DepartmentName = department.ShortName;
                    }
                }
                userClass.UserClassCount = await _context.UserClasses
                    .CountAsync(x => x.ClassId == userClass.ClassId && x.RegistrationScheduleId == userClass.RegistrationScheduleId, cancellationToken);
            }
        }

        return new UserClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

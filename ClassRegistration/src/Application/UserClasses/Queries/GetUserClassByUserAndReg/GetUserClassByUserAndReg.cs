using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Departments.Queries.GetDepartments;

namespace ClassRegistration.Application.UserClasses.Queries.GetUserClassByUserAndReg;

public record GetUserClassByUserAndRegQuery : IRequest<UserClassDto>
{
    public int UserId { get; set; }
    public int RegistrationId { get; set; }
}

public class GetUserClassByUserAndRegQueryValidator : AbstractValidator<GetUserClassByUserAndRegQuery>
{
    public GetUserClassByUserAndRegQueryValidator()
    {
    }
}

public class GetUserClassByUserAndRegQueryHandler : IRequestHandler<GetUserClassByUserAndRegQuery, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetUserClassByUserAndRegQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<UserClassDto> Handle(GetUserClassByUserAndRegQuery request, CancellationToken cancellationToken)
    {
        var userClasses = _context.UserClasses
            .AsNoTracking()
            .Include(x => x.Class)
            .Include(x => x.RegistrationSchedule)
            .Where(x => x.UserId == request.UserId && x.RegistrationScheduleId == request.RegistrationId);

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
                userClass.UserClassCount = 0;
                userClass.LecturerName = "";
                var uc = await _context.UserClasses
                    .Include(x => x.User)
                    .Where(x => x.ClassId == currentClass.Id && x.RegistrationScheduleId == request.RegistrationId)
                    .ToListAsync(cancellationToken);
                if (uc.Count > 0)
                {
                    foreach (var u in uc)
                    {
                        var roles = await _identityService.GetUserRoleAsync(u.UserId);
                        if (roles.Contains("Student"))
                        {
                            userClass.UserClassCount++;
                        }
                        if (roles.Contains("Lecturer"))
                        {
                            if (userClass.LecturerName != "")
                            {
                                userClass.LecturerName = userClass.LecturerName + ", " + u.User.UserName;
                            }
                            else
                            {
                                userClass.LecturerName += u.User.UserName;
                            }
                        }
                    }
                }
                userClass.Fee = userClass.RegistrationSchedule.FeePerCredit * userClass.Class.Credit;
            }
        }

        return new UserClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

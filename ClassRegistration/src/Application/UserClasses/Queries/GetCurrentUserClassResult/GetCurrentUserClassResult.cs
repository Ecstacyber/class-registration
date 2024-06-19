using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.UserClasses.Queries.GetCurrentUserClassResult;

public record GetCurrentUserClassResultQuery : IRequest<UserClassDto>
{
    public int UserId { get; set; }
}

public class GetCurrentUserClassResultQueryValidator : AbstractValidator<GetCurrentUserClassResultQuery>
{
    public GetCurrentUserClassResultQueryValidator()
    {
    }
}

public class GetCurrentUserClassResultQueryHandler : IRequestHandler<GetCurrentUserClassResultQuery, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetCurrentUserClassResultQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<UserClassDto> Handle(GetCurrentUserClassResultQuery request, CancellationToken cancellationToken)
    {
        var currentRegSchedule = await _context.RegistrationSchedules.FirstOrDefaultAsync(x => x.StartDate <= DateTime.Now && x.EndDate >= DateTime.Now, cancellationToken);
        if (currentRegSchedule == null)
        {
            return new UserClassDto
            {
                Result = [],
                Count = 0
            };
        }

        var currentUser = await _context.Humans.FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
        if (currentUser == null)
        {
            return new UserClassDto
            {
                Result = [],
                Count = 0
            };
        }

        var currentUserRegResult = await _context.UserClasses
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.Class)
            .Include(x => x.RegistrationSchedule)
            .Where(x => x.User == currentUser && x.RegistrationScheduleId == currentRegSchedule.Id)
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        foreach (var item in currentUserRegResult)
        {
            var itemClass = await _context.Classes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == item.ClassId, cancellationToken);
            if (itemClass != null)
            {
                var itemCourse = await _context.Courses.AsNoTracking().FirstOrDefaultAsync(x => x.Id == itemClass.CourseId, cancellationToken);
                if (itemCourse != null)
                {
                    item.CourseName = itemCourse.CourseName;
                    var department = await _context.Departments.AsNoTracking().FirstOrDefaultAsync(x => x.Id ==itemCourse.DepartmentId, cancellationToken);
                    if (department != null)
                    {
                        item.DepartmentName = department.ShortName;
                    }
                }
                var classType = await _context.ClassTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == itemClass.ClassTypeId, cancellationToken);
                if (classType != null)
                {
                    item.ClassType = classType.Type;
                }
            }

            item.UserClassCount = 0;
            var userClasses = await _context.UserClasses
                .Where(x => x.ClassId == item.ClassId && x.RegistrationScheduleId == currentRegSchedule.Id)
                .ToListAsync(cancellationToken);
            if (userClasses.Count > 0)
            {
                foreach (var userClass in userClasses)
                {
                    var roles = await _identityService.GetUserRoleAsync(userClass.UserId);
                    if (roles.Contains("Student"))
                    {
                        item.UserClassCount++;
                    }
                }
            }
            
            item.Fee = item.RegistrationSchedule.FeePerCredit * item.Class.Credit;
        }

        return new UserClassDto
        {
            Result = currentUserRegResult,
            Count = currentUserRegResult.Count
        };
    }
}

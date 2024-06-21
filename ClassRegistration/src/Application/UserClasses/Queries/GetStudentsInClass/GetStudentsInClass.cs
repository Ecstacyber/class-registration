using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Users.Queries;

namespace ClassRegistration.Application.UserClasses.Queries.GetStudentsInClass;

public record GetStudentsInClass : IRequest<UserClassDto>
{
    public int ClassId { get; set; }
    public int RegistrationId { get; set; }
}

public class GetUserInClassQueryValidator : AbstractValidator<GetStudentsInClass>
{
    public GetUserInClassQueryValidator()
    {
    }
}

public class GetUserInClassQueryHandler : IRequestHandler<GetStudentsInClass, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetUserInClassQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<UserClassDto> Handle(GetStudentsInClass request, CancellationToken cancellationToken)
    {
        var userClasses = await _context.UserClasses
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.RegistrationSchedule)
            .Include(x => x.Class)
            .Where(x => x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationId)
            .OrderBy(x => x.User.UserCode)
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        List<UserClassResult> result = new List<UserClassResult>();
        foreach (var userClass in userClasses)
        {
            if (userClass.User != null)
            {
                var role = await _identityService.GetUserRoleAsync(userClass.User.Id);
                if (role.Contains("Student"))
                {
                    result.Add(userClass);
                }
            }
        }

        return new UserClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

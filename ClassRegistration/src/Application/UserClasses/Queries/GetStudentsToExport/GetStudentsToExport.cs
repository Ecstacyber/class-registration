using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.UserClasses.Queries.GetStudentsToExport;

public record GetStudentsToExportQuery : IRequest<List<UserClassResult>>
{
    public int ClassId { get; set; }
    public int RegistrationId { get; set; }
}

public class GetStudentsToExportQueryValidator : AbstractValidator<GetStudentsToExportQuery>
{
    public GetStudentsToExportQueryValidator()
    {
    }
}

public class GetStudentsToExportQueryHandler : IRequestHandler<GetStudentsToExportQuery, List<UserClassResult>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetStudentsToExportQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<List<UserClassResult>> Handle(GetStudentsToExportQuery request, CancellationToken cancellationToken)
    {
        var userClasses = await _context.UserClasses
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.RegistrationSchedule)
            .Include(x => x.Class)
            .Where(x => x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationId)
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
        result = [.. result.OrderBy(x => x.User.UserCode)];

        return result;
    }
}

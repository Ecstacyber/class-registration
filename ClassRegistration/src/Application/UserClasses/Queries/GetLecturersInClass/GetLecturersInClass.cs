using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.UserClasses.Queries.GetLecturersInClass;

public record GetLecturersInClassQuery : IRequest<UserClassDto>
{
    public int ClassId { get; set; }
    public int RegistrationId { get; set; }
}

public class GetLecturersInClassQueryValidator : AbstractValidator<GetLecturersInClassQuery>
{
    public GetLecturersInClassQueryValidator()
    {
    }
}

public class GetLecturersInClassQueryHandler : IRequestHandler<GetLecturersInClassQuery, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetLecturersInClassQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<UserClassDto> Handle(GetLecturersInClassQuery request, CancellationToken cancellationToken)
    {
        var userClasses = await _context.UserClasses
            .Include(x => x.User)
            .Where(x => x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationId && x.User != null && x.User.Roles.Contains("Lecturer"))
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        List<UserClassResult> result = new List<UserClassResult>();
        foreach (var userClass in userClasses)
        {
            if (userClass.User != null)
            {
                var role = await _identityService.GetUserRoleAsync(userClass.User.Id);
                if (role.Contains("Lecturer"))
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

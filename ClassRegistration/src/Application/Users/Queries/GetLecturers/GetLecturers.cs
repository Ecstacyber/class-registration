using System.Text.RegularExpressions;
using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Users.Queries.GetLecturers;

public record GetLecturersQuery : IRequest<UserTableDataDto>
{
}

public class GetLecturersQueryValidator : AbstractValidator<GetLecturersQuery>
{
    public GetLecturersQueryValidator()
    {
    }
}

public class GetLecturersQueryHandler : IRequestHandler<GetLecturersQuery, UserTableDataDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetLecturersQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<UserTableDataDto> Handle(GetLecturersQuery request, CancellationToken cancellationToken)
    {
        var humans = await _context.Humans
            .AsNoTracking()
            .Where(x => x.Roles.Contains("Lecturer"))
            .ProjectTo<UserResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        List<UserResult> result = new List<UserResult>();
        foreach (var human in humans)
        {
            var role = await _identityService.GetUserRoleAsync(human.Id);
            if (role.Contains("Lecturer"))
            {
                result.Add(human);
            }
        }

        return new UserTableDataDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

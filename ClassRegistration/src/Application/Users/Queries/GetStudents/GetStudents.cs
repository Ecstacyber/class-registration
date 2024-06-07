using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Users.Queries.GetStudents;

public record GetStudentsQuery : IRequest<UserTableDataDto>
{
}

public class GetStudentsQueryValidator : AbstractValidator<GetStudentsQuery>
{
    public GetStudentsQueryValidator()
    {
    }
}

public class GetStudentsQueryHandler : IRequestHandler<GetStudentsQuery, UserTableDataDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetStudentsQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<UserTableDataDto> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
    {
        var humans = await _context.Humans
            .AsNoTracking()
            .ProjectTo<UserResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        List<UserResult> result = new List<UserResult>();
        foreach (var human in humans)
        {
            var role = await _identityService.GetUserRoleAsync(human.Id);
            if (role.Contains("Student"))
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

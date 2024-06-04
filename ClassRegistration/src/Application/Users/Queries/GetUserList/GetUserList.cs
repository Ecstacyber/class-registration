using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Common.Security;
using ClassRegistration.Application.Users.Queries.GetUserInfo;
using ClassRegistration.Domain.Constants;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Users.Queries.GetUserList;

[Authorize(Roles = Roles.Administrator)]
public record GetUserListQuery : IRequest<IEnumerable<UserDto>>
{
}

public class GetUserListQueryValidator : AbstractValidator<GetUserListQuery>
{
    public GetUserListQueryValidator()
    {
    }
}

public class GetUserListQueryHandler : IRequestHandler<GetUserListQuery, IEnumerable<UserDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    public GetUserListQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _context = applicationDbContext;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetUserListQuery request, CancellationToken cancellationToken)
    {
        return await _context.Humans
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}

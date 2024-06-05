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
    private readonly IIdentityService _identityService;
    private readonly IMapper _mapper;
    public GetUserListQueryHandler(IIdentityService identityService, IMapper mapper)
    {
        _identityService = identityService;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetUserListQuery request, CancellationToken cancellationToken)
    {
        var users = await _identityService.GetUserListAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }
}

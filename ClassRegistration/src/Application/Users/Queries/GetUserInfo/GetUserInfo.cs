using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Users.Queries.GetUserInfo;

public record GetUserInfoQuery() : IRequest<UserDto>
{

}

public class GetUserInfoQueryHandler : IRequestHandler<GetUserInfoQuery, UserDto>
{
    private readonly IIdentityService _identityService;
    private readonly IUser _user;
    private readonly IMapper _mapper;

    public GetUserInfoQueryHandler(IIdentityService identityService, IUser user, IMapper mapper)
    {
        _identityService = identityService;
        _user = user;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(GetUserInfoQuery request, CancellationToken cancellationToken)
    {
        Guard.Against.NullOrEmpty(_user.Id, nameof(_user.Id));
        var user = _mapper.Map<UserDto>(await _identityService.GetUserInfoAsync(_user.Id));
        return user;
    }
}

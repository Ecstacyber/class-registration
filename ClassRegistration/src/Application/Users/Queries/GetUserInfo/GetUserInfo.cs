using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Users.Queries.GetUserInfo;

public record GetUserInfoQuery() : IRequest<User>
{

}

public class GetUserInfoQueryHandler : IRequestHandler<GetUserInfoQuery, User>
{
    private readonly IIdentityService _identityService;
    private readonly IUser _user;

    public GetUserInfoQueryHandler(IIdentityService identityService, IUser user)
    {
        _identityService = identityService;
        _user = user;
    }

    public async Task<User> Handle(GetUserInfoQuery request, CancellationToken cancellationToken)
    {
        Guard.Against.NullOrEmpty(_user.Id, nameof(_user.Id));
        return await _identityService.GetUserInfoAsync(_user.Id);
    }
}

using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Common.Security;
using ClassRegistration.Domain.Constants;

namespace ClassRegistration.Application.Users.Queries.GetUserList;

[Authorize(Roles = Roles.Administrator)]
public record GetUserListQuery : IRequest<IEnumerable<IUser>>
{
}

public class GetUserListQueryValidator : AbstractValidator<GetUserListQuery>
{
    public GetUserListQueryValidator()
    {
    }
}

public class GetUserListQueryHandler : IRequestHandler<GetUserListQuery, IEnumerable<IUser>>
{
    private readonly IIdentityService _identityService;

    public GetUserListQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<IEnumerable<IUser>> Handle(GetUserListQuery request, CancellationToken cancellationToken)
    {
        return await _identityService.GetUserListAsync();
    }
}

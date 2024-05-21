using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Common.Security;
using ClassRegistration.Domain.Constants;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Users.Queries.GetUserList;

[Authorize(Roles = Roles.Administrator)]
public record GetUserListQuery : IRequest<IEnumerable<User>>
{
}

public class GetUserListQueryValidator : AbstractValidator<GetUserListQuery>
{
    public GetUserListQueryValidator()
    {
    }
}

public class GetUserListQueryHandler : IRequestHandler<GetUserListQuery, IEnumerable<User>>
{
    private readonly IIdentityService _identityService;

    public GetUserListQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<IEnumerable<User>> Handle(GetUserListQuery request, CancellationToken cancellationToken)
    {
        return await _identityService.GetUserListAsync();
    }
}

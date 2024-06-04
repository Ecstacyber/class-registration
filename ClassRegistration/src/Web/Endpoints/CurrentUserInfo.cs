using ClassRegistration.Application.Users.Queries.GetUserInfo;

namespace ClassRegistration.Web.Endpoints;

public class CurrentUserInfo : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetUserInfo);
    }

    public Task<UserDto> GetUserInfo(ISender sender, [AsParameters] GetUserInfoQuery query)
    {
        return sender.Send(query);
    }
}

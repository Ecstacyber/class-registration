using ClassRegistration.Application.Users.Queries.GetUserInfo;
using ClassRegistration.Application.Users.Queries.GetUserList;

namespace ClassRegistration.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetUserList);
    }

    public Task<IEnumerable<UserDto>> GetUserList(ISender sender, [AsParameters] GetUserListQuery query)
    {
        return sender.Send(query);
    }

}

using ClassRegistration.Application.Users.Queries.GetUserList;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Web.Endpoints;

public class UserList : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetUserList);
    }

    public Task<IEnumerable<User>> GetUserList(ISender sender, [AsParameters] GetUserListQuery query)
    {
        return sender.Send(query);
    }

}

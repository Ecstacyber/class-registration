using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Common.Security;
using ClassRegistration.Application.Users.Queries.GetUserList;
using ClassRegistration.Domain.Constants;

namespace ClassRegistration.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetUserList);
    }

    public Task<IEnumerable<IUser>> GetUserList(ISender sender, [AsParameters] GetUserListQuery query)
    {
        return sender.Send(query);
    }
}

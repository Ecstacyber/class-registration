using ClassRegistration.Application.UserClasses.Queries;
using ClassRegistration.Application.UserClasses.Queries.GetUserClassesByUserId;

namespace ClassRegistration.Web.Endpoints;

public class UserClassByUserId : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetUserClassByUserId);
    }

    public Task<UserClassDto> GetUserClassByUserId(ISender sender, [AsParameters] GetUserClassesByUserIdQuery query)
    {
        return sender.Send(query);
    }
}

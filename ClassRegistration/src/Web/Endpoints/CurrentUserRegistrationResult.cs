using ClassRegistration.Application.UserClasses.Queries;
using ClassRegistration.Application.UserClasses.Queries.GetCurrentUserClassResult;

namespace ClassRegistration.Web.Endpoints;

public class CurrentUserRegistrationResult : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetCurrentUserRegistrationResult);
    }

    public Task<UserClassDto> GetCurrentUserRegistrationResult(ISender sender, [AsParameters] GetCurrentUserClassResultQuery query)
    {
        return sender.Send(query);
    }
}

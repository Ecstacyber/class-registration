using ClassRegistration.Application.UserClasses.Queries;
using ClassRegistration.Application.UserClasses.Queries.GetLecturersInClass;

namespace ClassRegistration.Web.Endpoints;

public class LecturersInClass : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetLecturersInClass);
    }

    public Task<UserClassDto> GetLecturersInClass(ISender sender, [AsParameters] GetLecturersInClassQuery query)
    {
        return sender.Send(query);
    }
}

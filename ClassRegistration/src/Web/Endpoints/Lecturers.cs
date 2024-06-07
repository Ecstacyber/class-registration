using ClassRegistration.Application.Users.Queries;
using ClassRegistration.Application.Users.Queries.GetLecturers;

namespace ClassRegistration.Web.Endpoints;

public class Lecturers : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetLecturers);
    }

    public Task<UserTableDataDto> GetLecturers(ISender sender, [AsParameters] GetLecturersQuery query)
    {
        return sender.Send(query);
    }
}

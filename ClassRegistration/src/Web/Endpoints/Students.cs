using ClassRegistration.Application.Users.Queries;
using ClassRegistration.Application.Users.Queries.GetStudents;

namespace ClassRegistration.Web.Endpoints;

public class Students : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetStudents);
    }

    public Task<UserTableDataDto> GetStudents(ISender sender, [AsParameters] GetStudentsQuery query)
    {
        return sender.Send(query);
    }
}

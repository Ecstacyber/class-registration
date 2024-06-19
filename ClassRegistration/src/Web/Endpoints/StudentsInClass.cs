using ClassRegistration.Application.UserClasses.Queries;
using ClassRegistration.Application.UserClasses.Queries.GetStudentsInClass;

namespace ClassRegistration.Web.Endpoints;

public class StudentsInClass : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetStudentsInClass);
    }

    public Task<UserClassDto> GetStudentsInClass(ISender sender, [AsParameters] GetStudentsInClass query)
    {
        return sender.Send(query);
    }
}

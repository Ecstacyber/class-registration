using ClassRegistration.Application.Classes.Queries.GetClasses;
using ClassRegistration.Application.Classes.Queries.GetClassesByCourseId;

namespace ClassRegistration.Web.Endpoints;

public class ClassesByCourseId : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetClassesByCourseId);
    }

    public Task<ClassDto> GetClassesByCourseId(ISender sender, [AsParameters] GetClassesByCourseIdQuery query)
    {
        return sender.Send(query);
    }
}

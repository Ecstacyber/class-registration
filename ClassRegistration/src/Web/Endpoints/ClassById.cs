using ClassRegistration.Application.Classes.Queries.GetClassById;
using ClassRegistration.Application.Classes.Queries.GetClasses;

namespace ClassRegistration.Web.Endpoints;

public class ClassById : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetClassById);
    }

    public Task<ClassResult?> GetClassById(ISender sender, [AsParameters] GetClassByIdQuery query)
    {
        return sender.Send(query);
    }
}

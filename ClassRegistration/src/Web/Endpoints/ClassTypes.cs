using ClassRegistration.Application.ClassTypes.Queries.GetClassTypes;

namespace ClassRegistration.Web.Endpoints;

public class ClassTypes : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetClassTypes);
    }

    public Task<IEnumerable<ClassTypeDto>> GetClassTypes(ISender sender, [AsParameters] GetClassTypesQuery query)
    {
        return sender.Send(query);
    }
}

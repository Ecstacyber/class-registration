using ClassRegistration.Application.DepartmentsFKRef.Queries.GetDepartmentForFKRef;

namespace ClassRegistration.Web.Endpoints;

public class DepartmentsFKRef : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetDepartmentsForFKRef);
    }

    public Task<ICollection<DepartmentDtoForFKRef>> GetDepartmentsForFKRef(ISender sender, [AsParameters] GetDepartmentForFKRefQuery query)
    {
        return sender.Send(query);
    }
}

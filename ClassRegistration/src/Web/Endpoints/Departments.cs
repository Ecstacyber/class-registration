using ClassRegistration.Application.Departments.Commands.CreateDepartment;
using ClassRegistration.Application.Departments.Queries.GetDepartments;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Web.Endpoints;

public class Departments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetDepartments)
            .MapPost(CreateDepartment);
    }

    public Task<IEnumerable<DepartmentDto>> GetDepartments(ISender sender, [AsParameters] GetDepartmentsQuery query)
    {
        return sender.Send(query);
    }

    public Task<int> CreateDepartment(ISender sender, CreateDepartmentCommand command)
    {
        return sender.Send(command);
    }
}

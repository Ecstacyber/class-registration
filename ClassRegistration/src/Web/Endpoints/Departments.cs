using ClassRegistration.Application.Departments.Commands.CreateDepartment;
using ClassRegistration.Application.Departments.Commands.DeleteDepartment;
using ClassRegistration.Application.Departments.Commands.UpdateDepartment;
using ClassRegistration.Application.Departments.Queries.GetDepartments;

namespace ClassRegistration.Web.Endpoints;

public class Departments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetDepartments)
            .MapPost(CreateDepartment)
            .MapDelete(DeleteDepartment, "{id}")
            .MapPut(UpdateDeparment, "{id}");
    }

    public Task<DepartmentDto> GetDepartments(ISender sender, [AsParameters] GetDepartmentsQuery query)
    {
        return sender.Send(query);
    }

    public Task<int> CreateDepartment(ISender sender, CreateDepartmentCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> DeleteDepartment(ISender sender, int id)
    {
        await sender.Send(new DeleteDepartmentCommand(id));
        return Results.NoContent();
    }

    public async Task<IResult> UpdateDeparment(ISender sender, int id, UpdateDepartmentCommand command)
    {
        if (id != command.Id) return Results.BadRequest();
        await sender.Send(command);
        return Results.NoContent();
    }
}

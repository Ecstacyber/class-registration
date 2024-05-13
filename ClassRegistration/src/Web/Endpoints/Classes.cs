using ClassRegistration.Application.Classes.Commands.CreateClass;
using ClassRegistration.Application.Classes.Commands.DeleteClass;
using ClassRegistration.Application.Classes.Commands.UpdateClass;
using ClassRegistration.Application.Classes.Queries.GetClasses;

namespace ClassRegistration.Web.Endpoints;

public class Classes : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetClasses)
            .MapPost(CreateClass)
            .MapDelete(DeleteClass, "{id}")
            .MapPut(UpdateClass, "{id}");
    }

    public Task<IEnumerable<ClassDto>> GetClasses(ISender sender, [AsParameters] GetClassesQuery query)
    {
        return sender.Send(query);
    }

    public Task<int> CreateClass(ISender sender, CreateClassCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> DeleteClass(ISender sender, int id)
    {
        await sender.Send(new DeleteClassCommand(id));
        return Results.NoContent();
    }

    public async Task<IResult> UpdateClass(ISender sender, int id, UpdateClassCommand command)
    {
        if (id != command.Id) return Results.BadRequest();
        await sender.Send(command);
        return Results.NoContent();
    }
}

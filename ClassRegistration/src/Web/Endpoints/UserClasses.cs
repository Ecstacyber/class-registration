using ClassRegistration.Application.UserClasses.Commands.AddUserToClass;
using ClassRegistration.Application.UserClasses.Commands.RemoveUserFromClass;

namespace ClassRegistration.Web.Endpoints;

public class UserClasses : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(AddUserToClass)
            .MapDelete(RemoveUserFromClass, "{id}");
    }

    public Task<int> AddUserToClass(ISender sender, AddUserToClassCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> RemoveUserFromClass(ISender sender, int id)
    {
        await sender.Send(new RemoveUserFromClassCommand(id));
        return Results.NoContent();
    }
}

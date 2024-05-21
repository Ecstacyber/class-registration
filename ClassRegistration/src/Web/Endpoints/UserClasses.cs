using ClassRegistration.Application.Classes.Commands.CreateClass;
using ClassRegistration.Application.Classes.Commands.DeleteClass;
using ClassRegistration.Application.Classes.Commands.UpdateClass;
using ClassRegistration.Application.Classes.Queries.GetClasses;
using ClassRegistration.Application.UserClasses.Commands.AddUserToClass;
using ClassRegistration.Application.UserClasses.Commands.RemoveUserFromClass;
using ClassRegistration.Application.UserClasses.Queries.GetUserInClass;

namespace ClassRegistration.Web.Endpoints;

public class UserClasses : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetUserInClass)
            .MapPost(AddUserToClass)
            .MapDelete(RemoveUserFromClass, "{id}");
    }

    public Task<IEnumerable<UserClassDto>> GetUserInClass(ISender sender, [AsParameters] GetUsersInClassQuery query)
    {
        return sender.Send(query);
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

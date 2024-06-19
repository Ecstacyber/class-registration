using ClassRegistration.Application.Users.Commands.BlockUser;
using ClassRegistration.Application.Users.Commands.CreateUser;
using ClassRegistration.Application.Users.Commands.EditUser;
using ClassRegistration.Application.Users.Queries;
using ClassRegistration.Application.Users.Queries.GetUserList;

namespace ClassRegistration.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetUserList)
            .MapPost(CreateUser)
            .MapPut(EditUser, "EditUser")
            .MapPut(BlockUser, "BlockUser");
    }

    public Task<IEnumerable<UserDto>> GetUserList(ISender sender, [AsParameters] GetUserListQuery query)
    {
        return sender.Send(query);
    }

    public Task<List<string>> CreateUser(ISender sender, CreateUserCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> BlockUser(ISender sender, int id)
    {
        await sender.Send(new BlockUserCommand(id));
        return Results.NoContent();
    }

    public async Task<IResult> EditUser(ISender sender, int id, EditUserCommand command)
    {
        if (id != command.Id) return Results.BadRequest();
        await sender.Send(command);
        return Results.NoContent();
    }
}

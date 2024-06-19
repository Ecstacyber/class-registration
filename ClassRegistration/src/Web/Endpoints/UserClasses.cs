using ClassRegistration.Application.UserClasses.Commands.AddUserToClass;
using ClassRegistration.Application.UserClasses.Commands.RemoveUserFromClass;
using ClassRegistration.Application.UserClasses.Queries;
using ClassRegistration.Application.UserClasses.Queries.GetStudentsToExport;
using ClassRegistration.Application.UserClasses.Queries.GetUserClassByUserAndReg;

namespace ClassRegistration.Web.Endpoints;

public class UserClasses : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetStudentsToExport, "GetStudentsToExport")
            .MapGet(GetStudentClasses, "GetStudentClasses")
            .MapPost(AddUserToClass)
            .MapDelete(RemoveUserFromClass, "{id}");
    }

    public Task<List<UserClassResult>> GetStudentsToExport(ISender sender, [AsParameters] GetStudentsToExportQuery query)
    {
        return sender.Send(query);
    }

    public Task<UserClassDto> GetStudentClasses(ISender sender, [AsParameters] GetUserClassByUserAndRegQuery query)
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

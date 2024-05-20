using ClassRegistration.Application.Semesters.Commands.CreateSemester;
using ClassRegistration.Application.Semesters.Commands.DeleteSemester;
using ClassRegistration.Application.Semesters.Commands.UpdateSemester;
using ClassRegistration.Application.Semesters.Queries.GetSemesters;

namespace ClassRegistration.Web.Endpoints;

public class Semesters : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetSemesters)
            .MapPost(CreateSemester)
            .MapDelete(DeleteSemester, "{id}")
            .MapPut(UpdateSemester, "{id}");
    }

    public Task<IEnumerable<SemesterDto>> GetSemesters(ISender sender, [AsParameters] GetSemestersQuery query)
    {
        return sender.Send(query);
    }

    public Task<int> CreateSemester(ISender sender, CreateSemesterCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> DeleteSemester(ISender sender, int id)
    {
        await sender.Send(new DeleteSemesterCommand(id));
        return Results.NoContent();
    }

    public async Task<IResult> UpdateSemester(ISender sender, int id, UpdateSemesterCommand command)
    {
        if (id != command.Id) return Results.BadRequest();
        await sender.Send(command);
        return Results.NoContent();
    }
}

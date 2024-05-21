using ClassRegistration.Application.PrerequisiteCourses.Commands.CreateCoursePrerequisite;
using ClassRegistration.Application.PrerequisiteCourses.Commands.DeleteCoursePrerequisite;
using ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisite;

namespace ClassRegistration.Web.Endpoints;

public class PrerequisiteCourses : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetPrerequisiteCourses)
            .MapPost(CreateCoursePrerequisite)
            .MapDelete(DeleteCoursePrerequisite, "{id}");
    }

    public Task<IEnumerable<PrerequisiteCourseDto>> GetPrerequisiteCourses(ISender sender, [AsParameters] GetCoursePrerequisiteQuery query)
    {
        return sender.Send(query);
    }

    public Task<int> CreateCoursePrerequisite(ISender sender, CreateCoursePrerequisiteCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> DeleteCoursePrerequisite(ISender sender, int id)
    {
        await sender.Send(new DeleteCoursePrerequisiteCommand(id));
        return Results.NoContent();
    }
}

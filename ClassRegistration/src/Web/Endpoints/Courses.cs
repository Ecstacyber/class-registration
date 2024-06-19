using ClassRegistration.Application.Courses.Commands.CreateCourse;
using ClassRegistration.Application.Courses.Commands.DeleteCourse;
using ClassRegistration.Application.Courses.Commands.UpdateCourse;
using ClassRegistration.Application.Courses.Queries.GetCourses;

namespace ClassRegistration.Web.Endpoints;

public class Courses : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetCourses)
            .MapPost(CreateCourse)
            .MapDelete(DeleteCourse, "{id}")
            .MapPut(UpdateCourse, "{id}");
    }

    public Task<CourseDto> GetCourses(ISender sender, [AsParameters] GetCoursesQuery query)
    {
        return sender.Send(query);
    }

    public Task<int> CreateCourse(ISender sender, CreateCourseCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> DeleteCourse(ISender sender, int id)
    {
        await sender.Send(new DeleteCourseCommand(id));
        return Results.NoContent();
    }

    public async Task<IResult> UpdateCourse(ISender sender, int id, UpdateCourseCommand command)
    {
        if (id != command.Id) return Results.BadRequest();
        await sender.Send(command);
        return Results.NoContent();
    }
}

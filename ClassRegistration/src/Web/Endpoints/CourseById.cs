using ClassRegistration.Application.CourseById.Queries.GetCourseById;

namespace ClassRegistration.Web.Endpoints;

public class CourseById : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetCourseById);
    }

    public Task<CourseByIdDto?> GetCourseById(ISender sender, [AsParameters] GetCourseByIdQuery query)
    {
        return sender.Send(query);
    }
}

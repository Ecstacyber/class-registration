using ClassRegistration.Application.Courses.Queries.GetCoursesFK;

namespace ClassRegistration.Web.Endpoints;

public class CoursesFK : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetCoursesFK);
    }

    public Task<IEnumerable<CoursesFKDto>> GetCoursesFK(ISender sender, [AsParameters] GetCoursesFKQuery query)
    {
        return sender.Send(query);
    }
}

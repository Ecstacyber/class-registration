using ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisite;
using ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisiteByCourseId;

namespace ClassRegistration.Web.Endpoints;

public class PrerequisiteCoursesByCourseId : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetPrerequisiteCoursesByCourseId);
    }

    public Task<PrerequisiteCourseDto> GetPrerequisiteCoursesByCourseId(ISender sender, [AsParameters] GetCoursePrerequisiteByCourseIdQuery query)
    {
        return sender.Send(query);
    }
}

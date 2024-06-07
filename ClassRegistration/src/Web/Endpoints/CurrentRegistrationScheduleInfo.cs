using ClassRegistration.Application.RegistrationSchedules.Queries.GetCurrentRegistrationSchedule;

namespace ClassRegistration.Web.Endpoints;

public class CurrentRegistrationScheduleInfo : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetCurrentRegistrationSchedule);
    }

    public Task<CurrentRegScheduleDto> GetCurrentRegistrationSchedule(ISender sender, [AsParameters] GetCurrentRegistrationScheduleQuery query)
    {
        return sender.Send(query);
    }
}

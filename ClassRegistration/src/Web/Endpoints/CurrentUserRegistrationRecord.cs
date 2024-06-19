using ClassRegistration.Application.RegistrationRecords.Queries.GetCurrentUserRegistrationRecord;
using ClassRegistration.Application.RegistrationRecords.Queries;

namespace ClassRegistration.Web.Endpoints;

public class CurrentUserRegistrationRecord : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetCurrentUserRegistrationRecord);
    }

    public Task<RegistrationRecordDto> GetCurrentUserRegistrationRecord(ISender sender, [AsParameters] GetCurrentUserRegistrationRecordQuery query)
    {
        return sender.Send(query);
    }
}

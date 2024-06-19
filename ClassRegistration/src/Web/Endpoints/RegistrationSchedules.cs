using ClassRegistration.Application.RegistrationSchedules.Commands.CreateRegistrationSchedule;
using ClassRegistration.Application.RegistrationSchedules.Commands.DeleteRegistrationSchedule;
using ClassRegistration.Application.RegistrationSchedules.Commands.UpdateRegistrationSchedule;
using ClassRegistration.Application.RegistrationSchedules.Queries.GetPreviousSchedules;
using ClassRegistration.Application.RegistrationSchedules.Queries.GetRegistrationSchedules;
using ClassRegistration.Application.RegistrationSchedules.Queries.GetScheduleById;

namespace ClassRegistration.Web.Endpoints;

public class RegistrationSchedules : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetRegistrationSchedules, "GetRegistrationSchedules")
            .MapGet(GetPreviousRegistrationSchedules, "GetPreviousRegistrationSchedules")
            .MapGet(GetScheduleById, "GetScheduleById")
            .MapPost(CreateRegistrationSchedule)
            .MapDelete(DeleteRegistrationSchedule, "{id}")
            .MapPut(UpdateRegistrationSchedule, "{id}");
    }

    public Task<RegistrationScheduleDto> GetRegistrationSchedules(ISender sender, [AsParameters] GetRegistrationSchedulesQuery query)
    {
        return sender.Send(query);
    }

    public Task<RegistrationScheduleDto> GetPreviousRegistrationSchedules(ISender sender, [AsParameters] GetPreviousSchedulesQuery query)
    {
        return sender.Send(query);
    }

    public Task<RegistrationScheduleResult> GetScheduleById(ISender sender, [AsParameters] GetScheduleByIdQuery query)
    {
        return sender.Send(query);
    }

    public Task<int> CreateRegistrationSchedule(ISender sender, CreateRegistrationScheduleCommand command)
    {
        return sender.Send(command);
    }

    public async Task<IResult> DeleteRegistrationSchedule(ISender sender, int id)
    {
        await sender.Send(new DeleteRegistrationScheduleCommand(id));
        return Results.NoContent();
    }

    public async Task<IResult> UpdateRegistrationSchedule(ISender sender, int id, UpdateRegistrationScheduleCommand command)
    {
        if (id != command.Id) return Results.BadRequest();
        await sender.Send(command);
        return Results.NoContent();
    }
}

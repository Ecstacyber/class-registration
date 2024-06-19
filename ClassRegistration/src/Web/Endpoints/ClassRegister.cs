using ClassRegistration.Application.UserClasses.Commands;
using ClassRegistration.Application.UserClasses.Commands.ClassRegister;

namespace ClassRegistration.Web.Endpoints;

public class ClassRegister : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(RegisterStudent);
    }

    public Task<RegistrationResult> RegisterStudent(ISender sender, [AsParameters] ClassRegisterCommand command)
    {
        return sender.Send(command);
    }
}

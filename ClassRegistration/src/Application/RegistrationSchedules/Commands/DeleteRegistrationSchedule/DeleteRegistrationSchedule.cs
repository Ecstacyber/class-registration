using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.RegistrationSchedules.Commands.DeleteRegistrationSchedule;

public record DeleteRegistrationScheduleCommand(int Id) : IRequest
{
}

public class DeleteRegistrationScheduleCommandValidator : AbstractValidator<DeleteRegistrationScheduleCommand>
{
    public DeleteRegistrationScheduleCommandValidator()
    {
    }
}

public class DeleteRegistrationScheduleCommandHandler : IRequestHandler<DeleteRegistrationScheduleCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteRegistrationScheduleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteRegistrationScheduleCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.RegistrationSchedules.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);
        _context.RegistrationSchedules.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

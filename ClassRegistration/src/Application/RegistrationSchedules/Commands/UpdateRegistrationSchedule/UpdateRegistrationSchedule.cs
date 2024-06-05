using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.RegistrationSchedules.Commands.UpdateRegistrationSchedule;

public record UpdateRegistrationScheduleCommand : IRequest
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public required string StartDate { get; init; }
    public required string EndDate { get; init; }
}

public class UpdateRegistrationScheduleCommandValidator : AbstractValidator<UpdateRegistrationScheduleCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateRegistrationScheduleCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(x => x.Name)
            .NotEmpty()
            .MustAsync(BeUniqueName)
                .When(x => x.Id != 0)
                .WithMessage("'{PropertyName}' must be unique.")
                .WithErrorCode("Unique");
    }

    private async Task<bool> BeUniqueName(string name, CancellationToken token)
    {
        return await _context.RegistrationSchedules.AllAsync(x => x.Name != name, token);
    }
}

public class UpdateRegistrationScheduleCommandHandler : IRequestHandler<UpdateRegistrationScheduleCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateRegistrationScheduleCommandHandler(IApplicationDbContext context)
    {
        _context = context;

    }

    public async Task Handle(UpdateRegistrationScheduleCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.RegistrationSchedules.FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.StartDate = DateTime.Parse(request.StartDate);
        entity.EndDate = DateTime.Parse(request.EndDate);

        await _context.SaveChangesAsync(cancellationToken);
    }
}

using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.RegistrationSchedules.Commands.CreateRegistrationSchedule;

public record CreateRegistrationScheduleCommand : IRequest<int>
{
    public required string Name { get; set; }
    public required string StartDate { get; set; }
    public required string EndDate { get; set; }
    public int MaximumCredit { get; set; }
    public int FeePerCredit { get; set; }
}

public class CreateRegistrationScheduleCommandValidator : AbstractValidator<CreateRegistrationScheduleCommand>
{
    public CreateRegistrationScheduleCommandValidator()
    {
    }
}

public class CreateRegistrationScheduleCommandHandler : IRequestHandler<CreateRegistrationScheduleCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateRegistrationScheduleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateRegistrationScheduleCommand request, CancellationToken cancellationToken)
    {
        var entity = new RegistrationSchedule
        {
            Name = request.Name,
            StartDate = DateTime.Parse(request.StartDate),
            EndDate = DateTime.Parse(request.EndDate),
            MaximumCredit = request.MaximumCredit,
            FeePerCredit = request.FeePerCredit,
        };
        _context.RegistrationSchedules.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

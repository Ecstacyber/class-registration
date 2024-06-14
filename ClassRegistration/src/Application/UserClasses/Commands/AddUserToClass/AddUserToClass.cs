using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.UserClasses.Commands.AddUserToClass;

public record AddUserToClassCommand : IRequest<int>
{
    public int? ClassId { get; init; }
    public int? RegistrationScheduleId { get; init; }
    public int? UserId { get; init; }
    public string? Passed { get; init; }
}

public class AddUserToClassCommandValidator : AbstractValidator<AddUserToClassCommand>
{
    private readonly IApplicationDbContext _context;
    public AddUserToClassCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        //RuleFor(x => x.ClassId)
        //    .MustAsync(ExistedClass)
        //        .WithMessage("'{PropertyName}' must exist.")
        //        .WithErrorCode("NotFound");

        //RuleFor(x => x.RegistrationScheduleId)
        //    .MustAsync(ExistedRegistrationSchedule)
        //        .WithMessage("'{PropertyName}' must exist.")
        //        .WithErrorCode("NotFound");

    }

    private async Task<bool> ExistedRegistrationSchedule(int registrationScheduleId, CancellationToken token)
    {
        return await _context.RegistrationSchedules.AnyAsync(x => x.Id == registrationScheduleId);
    }

    private async Task<bool> ExistedClass(int classId, CancellationToken token)
    {
        return await _context.Classes.AnyAsync(x => x.Id == classId);
    }
}

public class AddUserToClassCommandHandler : IRequestHandler<AddUserToClassCommand, int>
{
    private readonly IApplicationDbContext _context;

    public AddUserToClassCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(AddUserToClassCommand request, CancellationToken cancellationToken)
    {
        if (_context.UserClasses.Any(x => x.UserId == request.UserId && x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationScheduleId))
        {
            return 0;
        }
        var entity = new UserClass
        {
            ClassId = request.ClassId,
            RegistrationScheduleId = request.RegistrationScheduleId,
            UserId = request.UserId,
            Passed = request.Passed == "true",
        };
        _context.UserClasses.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

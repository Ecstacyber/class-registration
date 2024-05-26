using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.UserClasses.Commands.AddUserToClass;

public record AddUserToClassCommand : IRequest<int>
{
    public int ClassId { get; init; }
    public int SemesterId { get; init; }
    public bool Passed { get; init; }
}

public class AddUserToClassCommandValidator : AbstractValidator<AddUserToClassCommand>
{
    private readonly IApplicationDbContext _context;
    public AddUserToClassCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(x => x.ClassId)
            .MustAsync(ExistedClass)
                .WithMessage("'{PropertyName}' must exist.")
                .WithErrorCode("NotFound"); ;

        RuleFor(x => x.SemesterId)
            .MustAsync(ExistedSemester)
                .WithMessage("'{PropertyName}' must exist.")
                .WithErrorCode("NotFound");

    }

    private async Task<bool> ExistedSemester(int semesterId, CancellationToken token)
    {
        return await _context.Semesters.AnyAsync(x => x.Id == semesterId);
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
        var entity = new UserClass
        {
            ClassId = request.ClassId,
            SemesterId = request.SemesterId,
            Passed = request.Passed,
        };
        _context.UserClasses.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

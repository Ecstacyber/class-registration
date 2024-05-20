using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Classes.Commands.CreateClass;

public record CreateClassCommand : IRequest<int>
{
    public int CourseId { get; init; }
    public string? ClassCode { get; init; }
    public int DayOfWeek { get; init; }
    public int StartPeriod { get; init; }
    public int EndPeriod { get; init; }
    public string? Fee { get; init; }
    public int Credit { get; init; }
}

public class CreateClassCommandValidator : AbstractValidator<CreateClassCommand>
{
    private readonly IApplicationDbContext _context;
    public CreateClassCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.CourseId)
            .MustAsync(ExistedCourseId)
                .WithMessage("'{PropertyName}' must exist.");

        RuleFor(v => v.ClassCode)
            .NotEmpty().WithMessage("'{PropertyName}' must exist.")
            .MaximumLength(10).WithMessage("ClassCode must not exceed 10 characters.");

        RuleFor(v => v.Credit)
            .GreaterThan(0);
    }

    private async Task<bool> ExistedCourseId(int courseId, CancellationToken cancellationToken)
    {
        return await _context.Courses.AnyAsync(x => x.Id == courseId, cancellationToken);
    }
}

public class CreateClassCommandHandler : IRequestHandler<CreateClassCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateClassCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateClassCommand request, CancellationToken cancellationToken)
    {
        var entity = new Class
        {
            CourseId = request.CourseId,
            ClassCode = request.ClassCode,
            Fee = request.Fee,
            DayOfWeek = request.DayOfWeek,
            StartPeriod = request.StartPeriod,
            EndPeriod = request.EndPeriod,
            Credit = request.Credit
        };
        _context.Classes.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

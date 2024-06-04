using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Classes.Commands.UpdateClass;

public record UpdateClassCommand : IRequest
{
    public int Id { get; init; }
    public int CourseId { get; init; }
    public string? ClassCode { get; init; }
    public int DayOfWeek { get; init; }
    public int StartPeriod { get; init; }
    public int EndPeriod { get; init; }
    public string? Fee { get; init; }
    public int Credit { get; init; }
}

public class UpdateClassCommandValidator : AbstractValidator<UpdateClassCommand>
{
    private readonly IApplicationDbContext _context;
    public UpdateClassCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.CourseId)
            .MustAsync(ExistedCourseId)
                .WithMessage("'{PropertyName}' must exist.");

        RuleFor(v => v.ClassCode)
            .NotEmpty().WithMessage("'{PropertyName}' must exist.")
            .MaximumLength(10).WithMessage("'{PropertyName}' must not exceed 10 characters.");

        RuleFor(v => v.Credit)
            .GreaterThan(0);
    }

    private async Task<bool> ExistedCourseId(int courseId, CancellationToken cancellationToken)
    {
        return await _context.Courses.AnyAsync(x => x.Id == courseId, cancellationToken);
    }
}

public class UpdateClassCommandHandler : IRequestHandler<UpdateClassCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateClassCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateClassCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Classes.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);

        entity.CourseId = request.CourseId;
        entity.ClassCode = request.ClassCode;
        entity.Fee = request.Fee;
        entity.DayOfWeek = request.DayOfWeek;
        entity.StartPeriod = request.StartPeriod;
        entity.EndPeriod = request.EndPeriod;
        entity.Credit = request.Credit;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

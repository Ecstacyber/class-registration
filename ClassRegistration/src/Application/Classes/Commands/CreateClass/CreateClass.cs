using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Classes.Commands.CreateClass;

public record CreateClassCommand : IRequest<int>
{
    public int CourseId { get; init; }
    public required string ClassCode { get; init; }
    public required int ClassTypeId { get; init; }
    public int DayOfWeek { get; init; }
    public int StartPeriod { get; init; }
    public int EndPeriod { get; init; }
    public int Capacity { get; init; }
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

        RuleFor(v => v.DayOfWeek)
            .NotEmpty()
            .GreaterThanOrEqualTo(2)
            .LessThanOrEqualTo(7);

        RuleFor(v => v.StartPeriod)
            .NotEmpty()
            .LessThan(x => x.EndPeriod);

        RuleFor(v => v.EndPeriod)
            .NotEmpty()
            .GreaterThan(x => x.StartPeriod);

        RuleFor(v => v.Capacity)
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
            ClassTypeId = request.ClassTypeId,
            DayOfWeek = request.DayOfWeek,
            StartPeriod = request.StartPeriod,
            EndPeriod = request.EndPeriod,
            Capacity = request.Capacity
        };
        _context.Classes.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

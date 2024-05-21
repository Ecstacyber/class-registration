using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.PrerequisiteCourses.Commands.CreateCoursePrerequisite;

public record CreateCoursePrerequisiteCommand : IRequest<int>
{
    public int? CourseId { get; init; }
    public int? PrerequisiteCourseId { get; init; }
    public bool RequirePassed { get; init; }
}

public class CreateCoursePrerequisiteCommandValidator : AbstractValidator<CreateCoursePrerequisiteCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateCoursePrerequisiteCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(x => x.CourseId)
            .NotNull().WithMessage("CourseId is required")
            .MustAsync(ExistedCourseId).WithMessage("CourseId does not exist");

        RuleFor(x => x.PrerequisiteCourseId)
            .NotNull().WithMessage("PrerequisiteCourseId is required")
            .MustAsync(ExistedCourseId).WithMessage("PrerequisiteCourseId does not exist");
    }

    private async Task<bool> ExistedCourseId(int? courseId, CancellationToken token)
    {
        return await _context.Courses.Select(x => x.Id).AnyAsync(token);
    }
}

public class CreateCoursePrerequisiteCommandHandler : IRequestHandler<CreateCoursePrerequisiteCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateCoursePrerequisiteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCoursePrerequisiteCommand request, CancellationToken cancellationToken)
    {

        var entity = new PrerequisiteCourse
        {
            CourseId = request.CourseId,
            PrerequisiteCourseId = request.PrerequisiteCourseId,
            RequirePassed = request.RequirePassed
        };
        _context.PrerequisiteCourses.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

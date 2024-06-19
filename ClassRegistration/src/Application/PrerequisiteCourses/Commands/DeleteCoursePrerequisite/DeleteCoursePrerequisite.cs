using Ardalis.GuardClauses;
using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.PrerequisiteCourses.Commands.DeleteCoursePrerequisite;

public record DeleteCoursePrerequisiteCommand(int Id) : IRequest
{
}

public class DeleteCoursePrerequisiteCommandValidator : AbstractValidator<DeleteCoursePrerequisiteCommand>
{
    public DeleteCoursePrerequisiteCommandValidator()
    {
    }
}

public class DeleteCoursePrerequisiteCommandHandler : IRequestHandler<DeleteCoursePrerequisiteCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCoursePrerequisiteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCoursePrerequisiteCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PrerequisiteCourses.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);
        _context.PrerequisiteCourses.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

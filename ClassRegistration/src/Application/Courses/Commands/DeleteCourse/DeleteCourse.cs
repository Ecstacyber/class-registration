using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Courses.Commands.DeleteCourse;

public record DeleteCourseCommand(int Id) : IRequest
{
}

public class DeleteCourseCommandValidator : AbstractValidator<DeleteCourseCommand>
{
    public DeleteCourseCommandValidator()
    {
    }
}

public class DeleteCourseCommandHandler : IRequestHandler<DeleteCourseCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCourseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Courses.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);
        _context.Courses.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

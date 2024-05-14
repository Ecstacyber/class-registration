using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Semesters.Commands.DeleteSemester;

public record DeleteSemesterCommand(int Id) : IRequest
{
}

public class DeleteSemesterCommandValidator : AbstractValidator<DeleteSemesterCommand>
{
    public DeleteSemesterCommandValidator()
    {
    }
}

public class DeleteSemesterCommandHandler : IRequestHandler<DeleteSemesterCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteSemesterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteSemesterCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Semesters.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);
        _context.Semesters.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

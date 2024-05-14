using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Classes.Commands.DeleteClass;

public record DeleteClassCommand(int Id) : IRequest
{
}

public class DeleteClassCommandValidator : AbstractValidator<DeleteClassCommand>
{
    public DeleteClassCommandValidator()
    {
    }
}

public class DeleteClassCommandHandler : IRequestHandler<DeleteClassCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteClassCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteClassCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Classes.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);
        _context.Classes.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

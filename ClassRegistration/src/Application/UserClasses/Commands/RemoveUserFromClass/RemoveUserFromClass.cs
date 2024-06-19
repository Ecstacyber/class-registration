using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.UserClasses.Commands.RemoveUserFromClass;

public record RemoveUserFromClassCommand(int Id) : IRequest
{
}

public class RemoveUserFromClassCommandValidator : AbstractValidator<RemoveUserFromClassCommand>
{
    public RemoveUserFromClassCommandValidator()
    {
    }
}

public class RemoveUserFromClassCommandHandler : IRequestHandler<RemoveUserFromClassCommand>
{
    private readonly IApplicationDbContext _context;

    public RemoveUserFromClassCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(RemoveUserFromClassCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.UserClasses.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);
        _context.UserClasses.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

    }
}

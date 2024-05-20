using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Departments.Commands.DeleteDepartment;

public record DeleteDepartmentCommand(int Id) : IRequest
{
}

public class DeleteDepartmentCommandValidator : AbstractValidator<DeleteDepartmentCommand>
{
    public DeleteDepartmentCommandValidator()
    {
    }
}

public class DeleteDepartmentCommandHandler : IRequestHandler<DeleteDepartmentCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteDepartmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Departments
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.Departments.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}

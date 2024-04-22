using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Departments.Commands.UpdateDepartment;

public record UpdateDepartmentCommand : IRequest
{
    public int Id { get; init; }
    public string? ShortName { get; init; }
    public string? FullName { get; init; }
    public string? Description { get; init; }
}

public class UpdateDepartmentCommandValidator : AbstractValidator<UpdateDepartmentCommand>
{
    public UpdateDepartmentCommandValidator()
    {
        RuleFor(x => x.ShortName).MaximumLength(20).NotEmpty();
        RuleFor(x => x.FullName).MaximumLength(200).NotEmpty();
    }
}

public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateDepartmentCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateDepartmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Departments
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.ShortName = request.ShortName;
        entity.FullName = request.FullName;
        entity.Description = request.Description;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassRegistration.Application.Departments.Commands.CreateDepartment;

public record CreateDepartmentCommand : IRequest<int>
{
    public string? ShortName { get; init; }
    public string? FullName { get; set; }
    public string? Description { get; set; }
}

public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateDepartmentCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.ShortName)
            .NotEmpty()
            .MaximumLength(50)
            .MustAsync(BeUniqueShortName)
                .WithMessage("'{PropertyName}' must be unique.")
                .WithErrorCode("Unique");
    }

    public async Task<bool> BeUniqueShortName(string shortName, CancellationToken cancellationToken)
    {
        return await _context.Departments
            .AllAsync(l => l.ShortName != shortName, cancellationToken);
    }
}

public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateDepartmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var entity = new Department
        {
            ShortName = request.ShortName,
            FullName = request.FullName,
            Description = request.Description
        };
        _context.Departments.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

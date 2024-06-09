using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassRegistration.Application.Users.Commands.EditUser;

public record EditUserCommand : IRequest
{
    public int Id { get; set; }
    public required string UserName { get; init; }
    public required string Password { get; init; }
    public required string UserCode { get; init; }
    public required string Email { get; init; }
    public int DepartmentId { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
}

public class EditUserCommandValidator : AbstractValidator<EditUserCommand>
{
    private readonly IApplicationDbContext _context;
    public EditUserCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(x => x.UserCode)
            .NotEmpty()
            .MaximumLength(10)
            .MustAsync(BeUniqueUserCode)
                .WithMessage("'{PropertyName}' must be unique.")
                .WithErrorCode("Unique");

        RuleFor(x => x.DepartmentId)
            .MustAsync(ExistedDepartmentId)
                .WithMessage("'{PropertyName}' must exist.")
                .WithErrorCode("NotFound");
    }

    private async Task<bool> BeUniqueUserCode(string userCode, CancellationToken token)
    {
        return await _context.Humans.AllAsync(x => x.UserCode != userCode, token);
    }

    private async Task<bool> ExistedDepartmentId(int departmentId, CancellationToken token)
    {
        return await _context.Departments.AnyAsync(x => x.Id == departmentId, token);
    }
}

public class EditUserCommandHandler : IRequestHandler<EditUserCommand>
{
    private readonly IApplicationDbContext _context;

    public EditUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(EditUserCommand request, CancellationToken cancellationToken)
    {
        var human = await _context.Humans.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, human);

        human.UserCode = request.UserCode;
        human.DepartmentId = request.DepartmentId;
        human.UserName = request.UserName;
        human.Email = request.Email;
        await _context.SaveChangesAsync(cancellationToken);
        
        
    }
}

using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassRegistration.Application.Users.Commands.EditUser;

public record EditUserCommand : IRequest<List<string>>
{
    public int Id { get; set; }
    public required string UserName { get; init; }
    public required string Password { get; init; }
    public required string UserCode { get; init; }
    public required string Email { get; init; }
    public required string Enabled { get; init; }
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

public class EditUserCommandHandler : IRequestHandler<EditUserCommand, List<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public EditUserCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<List<string>> Handle(EditUserCommand request, CancellationToken cancellationToken)
    {
        var human = await _context.Humans.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, human);

        human.UserCode = request.UserCode;
        human.DepartmentId = request.DepartmentId;
        human.UserName = request.UserName;
        human.Email = request.Email;
        if (request.Enabled == "false")
        {
            human.Enabled = false;
            await _identityService.BlockUserAsync(request.Id);
        }
        if (request.Enabled == "true")
        {
            human.Enabled = true;
            await _identityService.UnblockUserAsync(request.Id);
        }
        var editResult = await _identityService.EditUserAsync(request.Id, request.UserName, request.Password, request.Email, request.Roles);
        if (editResult.Errors.Length > 0)
        {
            return editResult.Errors.ToList();
        }
        else
        {
            await _context.SaveChangesAsync(cancellationToken);
            return ["Success"];
        }
        
    }
}

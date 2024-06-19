using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Users.Commands.CreateUser;

public record CreateUserCommand : IRequest<List<string>>
{
    public required string UserName { get; init; }
    public required string Password { get; init; }
    public required string UserCode { get; init; }
    public required string Email { get; init; }
    public int DepartmentId { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
}

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    private readonly IApplicationDbContext _context;
    public CreateUserCommandValidator(IApplicationDbContext context)
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

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, List<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public CreateUserCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<List<string>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var human = new User
        {
            UserName = request.UserName,
            UserCode = request.UserCode,
            Email = request.Email,
            DepartmentId = request.DepartmentId,
            Enabled = true
        };
        await _context.Humans.AddAsync(human);
        await _context.SaveChangesAsync(cancellationToken);
        var (result, userId) = await _identityService.CreateUserAsync(request.Email, request.Password, human.Id);
        if (result.Errors.Length > 0)
        {
            _context.Humans.Remove(human);
            await _context.SaveChangesAsync(cancellationToken);
            return [.. result.Errors];
        }
        else
        {
            await _identityService.AddToRoleAsync(userId, request.Roles);
            await _context.SaveChangesAsync(cancellationToken);
            return new List<string>()
            {
                human.Id.ToString()
            };
        }
    }
}

using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Users.Commands.BlockUser;

public record BlockUserCommand(int Id) : IRequest<bool>
{
}

public class BlockUserCommandValidator : AbstractValidator<BlockUserCommand>
{
    public BlockUserCommandValidator()
    {
    }
}

public class BlockUserCommandHandler : IRequestHandler<BlockUserCommand, bool>
{
    private readonly IIdentityService _identityService;

    public BlockUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<bool> Handle(BlockUserCommand request, CancellationToken cancellationToken)
    {        
        return await _identityService.BlockUserAsync(request.Id);
    }
}

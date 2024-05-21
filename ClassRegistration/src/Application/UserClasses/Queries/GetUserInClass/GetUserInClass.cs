using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.UserClasses.Queries.GetUserInClass;

public record GetUsersInClassQuery : IRequest<IEnumerable<UserClassDto>>
{
}

public class GetUserInClassQueryValidator : AbstractValidator<GetUsersInClassQuery>
{
    public GetUserInClassQueryValidator()
    {
    }
}

public class GetUserInClassQueryHandler : IRequestHandler<GetUsersInClassQuery, IEnumerable<UserClassDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUserInClassQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserClassDto>> Handle(GetUsersInClassQuery request, CancellationToken cancellationToken)
    {
        return await _context.UserClasses
            .ProjectTo<UserClassDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}

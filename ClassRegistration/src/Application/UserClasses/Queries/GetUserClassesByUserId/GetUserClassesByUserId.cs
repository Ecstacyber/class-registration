using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.UserClasses.Queries.GetUserClassesByUserId;

public record GetUserClassesByUserIdQuery : IRequest<UserClassDto>
{
    public int UserId { get; set; }
}

public class GetUserClassesByUserIdQueryValidator : AbstractValidator<GetUserClassesByUserIdQuery>
{
    public GetUserClassesByUserIdQueryValidator()
    {
    }
}

public class GetUserClassesByUserIdQueryHandler : IRequestHandler<GetUserClassesByUserIdQuery, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUserClassesByUserIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UserClassDto> Handle(GetUserClassesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var userClasses = _context.UserClasses
            .AsNoTracking()
            .Include(x => x.Class)
            .Include(x => x.RegistrationSchedule)
            .Where(x => x.UserId == request.UserId);

        var result = await userClasses
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new UserClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

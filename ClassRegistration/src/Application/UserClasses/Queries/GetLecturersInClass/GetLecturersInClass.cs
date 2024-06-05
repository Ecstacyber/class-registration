using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.UserClasses.Queries.GetUserInClass;

namespace ClassRegistration.Application.UserClasses.Queries.GetLecturersInClass;

public record GetLecturersInClassQuery : IRequest<IEnumerable<UserClassDto>>
{
}

public class GetLecturersInClassQueryValidator : AbstractValidator<GetLecturersInClassQuery>
{
    public GetLecturersInClassQueryValidator()
    {
    }
}

public class GetLecturersInClassQueryHandler : IRequestHandler<GetLecturersInClassQuery, IEnumerable<UserClassDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetLecturersInClassQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserClassDto>> Handle(GetLecturersInClassQuery request, CancellationToken cancellationToken)
    {
        return await _context.UserClasses
            .ProjectTo<UserClassDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}

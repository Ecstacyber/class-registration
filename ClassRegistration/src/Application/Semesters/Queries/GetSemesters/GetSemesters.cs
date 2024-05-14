using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Semesters.Queries.GetSemesters;

public record GetSemestersQuery : IRequest<IEnumerable<SemesterDto>>
{
}

public class GetSemestersQueryValidator : AbstractValidator<GetSemestersQuery>
{
    public GetSemestersQueryValidator()
    {
    }
}

public class GetSemestersQueryHandler : IRequestHandler<GetSemestersQuery, IEnumerable<SemesterDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSemestersQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SemesterDto>> Handle(GetSemestersQuery request, CancellationToken cancellationToken)
    {
        return await _context.Semesters
            .AsNoTracking()
            .ProjectTo<SemesterDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}

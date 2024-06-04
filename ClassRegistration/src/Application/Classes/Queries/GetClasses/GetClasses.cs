using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Classes.Queries.GetClasses;

public record GetClassesQuery : IRequest<IEnumerable<ClassDto>>
{
}

public class GetClassesQueryValidator : AbstractValidator<GetClassesQuery>
{
    public GetClassesQueryValidator()
    {
    }
}

public class GetClassesQueryHandler : IRequestHandler<GetClassesQuery, IEnumerable<ClassDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClassesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ClassDto>> Handle(GetClassesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Classes
            .AsNoTracking()
            .ProjectTo<ClassDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}

using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.ClassTypes.Queries.GetClassTypes;

public record GetClassTypesQuery : IRequest<IEnumerable<ClassTypeDto>>
{
}

public class GetClassTypesQueryValidator : AbstractValidator<GetClassTypesQuery>
{
    public GetClassTypesQueryValidator()
    {
    }
}

public class GetClassTypesQueryHandler : IRequestHandler<GetClassTypesQuery, IEnumerable<ClassTypeDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClassTypesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ClassTypeDto>> Handle(GetClassTypesQuery request, CancellationToken cancellationToken)
    {
        return await _context.ClassTypes
            .AsNoTracking()
            .Select(x => new ClassTypeDto { ClassTypeId = x.Id, Type = x.Type })
            .ToListAsync(cancellationToken);
    }
}

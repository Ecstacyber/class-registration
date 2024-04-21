using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.TodoLists.Queries.GetTodos;

namespace ClassRegistration.Application.Departments.Queries.GetDepartments;

public record GetDepartmentsQuery : IRequest<IEnumerable<DepartmentDto>>
{
}

public class GetDepartmentsQueryValidator : AbstractValidator<GetDepartmentsQuery>
{
    public GetDepartmentsQueryValidator()
    {
    }
}

public class GetDepartmentsQueryHandler : IRequestHandler<GetDepartmentsQuery, IEnumerable<DepartmentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDepartmentsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DepartmentDto>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Departments
            .AsNoTracking()
            .ProjectTo<DepartmentDto>(_mapper.ConfigurationProvider)
            .OrderBy(x => x.ShortName)
            .ToListAsync(cancellationToken);
    }
}

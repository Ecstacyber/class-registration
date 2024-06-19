using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.DepartmentsFKRef.Queries.GetDepartmentForFKRef;

public record GetDepartmentForFKRefQuery : IRequest<ICollection<DepartmentDtoForFKRef>>
{
}

public class GetDepartmentForFKRefQueryValidator : AbstractValidator<GetDepartmentForFKRefQuery>
{
    public GetDepartmentForFKRefQueryValidator()
    {
    }
}

public class GetDepartmentForFKRefQueryHandler : IRequestHandler<GetDepartmentForFKRefQuery, ICollection<DepartmentDtoForFKRef>>
{
    private readonly IApplicationDbContext _context;

    public GetDepartmentForFKRefQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ICollection<DepartmentDtoForFKRef>> Handle(GetDepartmentForFKRefQuery request, CancellationToken cancellationToken)
    {
        return await _context.Departments.Select(x => new DepartmentDtoForFKRef
        {
            DepartmentId = x.Id,
            DepartmentName = x.ShortName
        }).ToListAsync(cancellationToken);
    }
}

using System.ComponentModel.Design;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.TodoLists.Queries.GetTodos;
using ClassRegistration.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ClassRegistration.Application.Departments.Queries.GetDepartments;

public record GetDepartmentsQuery : IRequest<DepartmentDto>
{
    public string? InlineCount { get; set; }
    public int? Skip { get; set; }
    public int? Top { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterParams { get; set; }
    public string? FilterValue { get; set; }
}

public class GetDepartmentsQueryValidator : AbstractValidator<GetDepartmentsQuery>
{
    public GetDepartmentsQueryValidator()
    {
    }
}

public class GetDepartmentsQueryHandler : IRequestHandler<GetDepartmentsQuery, DepartmentDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDepartmentsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<DepartmentDto> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
    {
        List<Department> departments = new List<Department>();
        int totalItems = 0;

        if (!string.IsNullOrEmpty(request.FilterParams) && !string.IsNullOrEmpty(request.FilterValue))
        {
            string[] filterParams = request.FilterParams.Split('-');
            if (filterParams.Length > 0)
            {               
                switch (filterParams[0])
                {
                    case "shortName":
                        departments = await _context.Departments
                            .AsNoTracking()
                            .Where(x => x.ShortName.ToLower().Contains(request.FilterValue))
                            .ToListAsync(cancellationToken);                        
                        break;
                    case "fullName":
                        departments = await _context.Departments
                            .AsNoTracking()
                            .Where(x => x.FullName.ToLower().Contains(request.FilterValue))
                            .ToListAsync(cancellationToken);
                        break;
                    default:
                        break;
                }
                totalItems = departments.Count;

                if (!string.IsNullOrEmpty(request.OrderBy))
                {
                    string[] sortParams = request.OrderBy.Split('-');
                    if (sortParams.Length > 0)
                    {
                        if (sortParams[0] == "shortName")
                        {
                            if (sortParams[1] == "Descending")
                            {
                                departments = [.. departments.OrderByDescending(x => x.ShortName)];
                            }
                            else
                            {
                                if (sortParams[1] == "Ascending")
                                {
                                    departments = [.. departments.OrderBy(x => x.ShortName)];
                                }
                            }
                        }
                        if (sortParams[0] == "fullName")
                        {
                            if (sortParams[1] == "Descending")
                            {
                                departments = [.. departments.OrderByDescending(x => x.FullName)];
                            }
                            else
                            {
                                if (sortParams[1] == "Ascending")
                                {
                                    departments = [.. departments.OrderBy(x => x.FullName)];
                                }
                            }
                        }
                    }
                }

                if (request.Skip != null && request.Top != null)
                {
                    departments = departments.Skip((int)request.Skip).Take((int)request.Top).ToList();
                }
            }
        }
        else
        {
            if (!string.IsNullOrEmpty(request.OrderBy))
            {
                string[] sortParams = request.OrderBy.Split('-');
                if (sortParams.Length > 0)
                {
                    if (sortParams[0] == "shortName")
                    {
                        if (sortParams[1] == "Descending")
                        {
                            departments = await _context.Departments
                                .AsNoTracking()
                                .OrderByDescending(x => x.ShortName)
                                .ToListAsync(cancellationToken);
                        }
                        else
                        {
                            if (sortParams[1] == "Ascending")
                            {
                                departments = await _context.Departments
                                    .AsNoTracking()
                                    .OrderBy(x => x.ShortName)
                                    .ToListAsync(cancellationToken);
                            }
                        }
                    }
                    if (sortParams[0] == "fullName")
                    {
                        if (sortParams[1] == "Descending")
                        {
                            departments = await _context.Departments
                                .AsNoTracking()
                                .OrderByDescending(x => x.ShortName)
                                .ToListAsync(cancellationToken);
                        }
                        else
                        {
                            if (sortParams[1] == "Ascending")
                            {
                                departments = await _context.Departments
                                    .AsNoTracking()
                                    .OrderBy(x => x.FullName)
                                    .ToListAsync(cancellationToken);
                            }
                        }
                    }
                    totalItems = departments.Count;
                }

                if (request.Skip != null && request.Top != null)
                {
                    departments = departments.Skip((int)request.Skip).Take((int)request.Top).ToList();
                }
            }
            else
            {
                if (request.Skip != null && request.Top != null)
                {
                    departments = await _context.Departments
                        .AsNoTracking()
                        .OrderBy(x => x.Id)
                        .Skip((int)request.Skip)
                        .Take((int)request.Top).ToListAsync(cancellationToken);
                    totalItems = departments.Count;
                }
                else
                {
                    departments = await _context.Departments
                        .AsNoTracking()
                        .ToListAsync(cancellationToken);
                    totalItems = departments.Count;
                }
            }
        }
        
        List<Result> result = new List<Result>();

        foreach (var department in departments)
        {
            result.Add(new Result
            {
                Id = department.Id,
                ShortName = department.ShortName,
                FullName = department.FullName
            });
        }

        return new DepartmentDto
        {
            Result = result,
            Count = totalItems
        };
    }
}

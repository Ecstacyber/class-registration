using System.ComponentModel.Design;
using System.Linq;
using System.Reflection.Metadata;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.TodoLists.Queries.GetTodos;
using ClassRegistration.Domain.Entities;
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
    public string? SearchString { get; set; }
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
        List<Department> departments = await _context.Departments.AsNoTracking().ToListAsync(cancellationToken);
        List<Department> totalResult = await _context.Departments.AsNoTracking().ToListAsync(cancellationToken);
        //_logger.LogInformation("Getting departments. Params:\norderBy: " + request.OrderBy + "\nskip: " + request.Skip + "\ntop: " + request.Top);

        if (request.OrderBy != null)
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
                if (sortParams[0] == "description")
                {
                    if (sortParams[1] == "Descending")
                    {
                        departments = [.. departments.OrderByDescending(x => x.Description)];
                    }
                    else
                    {
                        if (sortParams[1] == "Ascending")
                        {
                            departments = [.. departments.OrderBy(x => x.Description)];
                        }
                    }
                }
            }
        }

        if (request.FilterParams != null && request.FilterValue != null)
        {
            string[] filterParams = request.FilterParams.Split('-');
            if (filterParams.Length > 0)
            {
                switch (filterParams[0])
                {
                    case "shortName":
                        switch (filterParams[1])
                        {
                            case "startswith":
                                departments = departments.Where(x => x.ShortName.StartsWith(request.FilterValue, StringComparison.CurrentCultureIgnoreCase)).ToList();
                                break;
                            default:
                                break;
                        }
                        break;
                    case "fullName":
                        switch (filterParams[1])
                        {
                            case "startswith":
                                departments = departments.Where(x => x.FullName.StartsWith(request.FilterValue, StringComparison.CurrentCultureIgnoreCase)).ToList();
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }               
            }
        }

        if (request.SearchString != null)
        {
            departments = departments.Where(x => x.ShortName.ToLower().Contains(request.SearchString.ToLower()) || x.FullName.ToLower().Contains(request.SearchString.ToLower())).ToList();
        }
        
        if (request.Skip != null && request.Top != null)
        {
            departments = departments.Skip((int)request.Skip).Take((int)request.Top).ToList();
        }

        //departments = await _context.Departments
        //        .AsNoTracking()
        //        .OrderBy(x => x.ShortName)
        //        .ToListAsync(cancellationToken);

        List<Result> result = new List<Result>();
        List<Items> items = new List<Items>();

        foreach (var item in totalResult)
        {           
            items.Add(new Items
            {
                Id = item.Id,
                ShortName = item.ShortName,
                FullName = item.FullName,
                Description = item.Description
            });
        }

        foreach (var department in departments)
        {
            result.Add(new Result
            {
                Id = department.Id,
                ShortName = department.ShortName,
                FullName = department.FullName,
                Description = department.Description
            });
        }

        return new DepartmentDto
        {
            Result = result,
            Items = items,
            Count = items.Count
        };
    }
}

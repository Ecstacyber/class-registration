using System.Linq;
using ClassRegistration.Application.Classes.Queries.GetClasses;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Courses.Queries.GetCourses;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Classes.Queries.GetClassesByCourseId;

public record GetClassesByCourseIdQuery : IRequest<ClassDto>
{
    public int CourseId { get; set; }
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterAttribute { get; set; }
    public string? FilterValue { get; set; }
}

public class GetClassesByCourseIdQueryValidator : AbstractValidator<GetClassesByCourseIdQuery>
{
    public GetClassesByCourseIdQueryValidator()
    {
    }
}

public class GetClassesByCourseIdQueryHandler : IRequestHandler<GetClassesByCourseIdQuery, ClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClassesByCourseIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ClassDto> Handle(GetClassesByCourseIdQuery request, CancellationToken cancellationToken)
    {
        var classes = _context.Classes
            .Include(x => x.Course)
            .Include(x => x.UserClasses)
            .Include(x => x.ClassType)
            .Where(x => x.CourseId == request.CourseId)
            .AsNoTracking();
        int totalCount = 0;

        if (!string.IsNullOrEmpty(request.FilterAttribute) && !string.IsNullOrEmpty(request.FilterValue))
        {
            switch (request.FilterAttribute)
            {
                case "classCode":
                    classes = classes.Where(x => x.ClassCode.ToLower().Contains(request.FilterValue));
                    break;
                case "dayOfWeek":
                    if (int.TryParse(request.FilterValue, out int day))
                    {
                        classes = classes.Where(x => x.DayOfWeek == day);
                    }
                    break;
                case "startPeriod":
                    if (int.TryParse(request.FilterValue, out int startPeriod))
                    {
                        classes = classes.Where(x => x.StartPeriod == startPeriod);
                    }
                    break;
                case "endPeriod":
                    if (int.TryParse(request.FilterValue, out int endPeriod))
                    {
                        classes = classes.Where(x => x.EndPeriod == endPeriod);
                    }
                    break;
                case "capacity":
                    if (int.TryParse(request.FilterValue, out int capacity))
                    {
                        classes = classes.Where(x => x.Capacity == capacity);
                    }
                    break;
                default:
                    break;
            }
        }

        if (!string.IsNullOrEmpty(request.OrderBy))
        {
            var orderBy = request.OrderBy.Split('-');
            switch (orderBy[0])
            {
                case "classCode":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.ClassCode) : classes.OrderByDescending(x => x.ClassCode);
                    break;
                case "dayOfWeek":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.DayOfWeek) : classes.OrderByDescending(x => x.DayOfWeek);
                    break;
                case "startPeriod":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.StartPeriod) : classes.OrderByDescending(x => x.StartPeriod);
                    break;
                case "endPeriod":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.EndPeriod) : classes.OrderByDescending(x => x.EndPeriod);
                    break;
                case "capacity":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.Capacity) : classes.OrderByDescending(x => x.Capacity);
                    break;
                default:
                    break;
            }
        }
        else
        {
            classes = classes.OrderByDescending(x => x.Id);
        }

        classes = classes.Skip(request.Skip).Take(request.Take);

        var result = await classes
            .ProjectTo<ClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        if (string.IsNullOrEmpty(request.FilterAttribute) && string.IsNullOrEmpty(request.FilterValue))
        {
            totalCount = await _context.Classes.CountAsync(cancellationToken);
        }
        else
        {
            totalCount = result.Count;
        }

        return new ClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

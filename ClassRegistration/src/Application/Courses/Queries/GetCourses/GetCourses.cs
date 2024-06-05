using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Departments.Queries.GetDepartments;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Courses.Queries.GetCourses;

public record GetCoursesQuery : IRequest<CourseDto>
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterAttribute { get; set; }
    public string? FilterValue { get; set; }
}

public class GetCoursesQueryValidator : AbstractValidator<GetCoursesQuery>
{
    public GetCoursesQueryValidator()
    {
    }
}

public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, CourseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCoursesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CourseDto> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
    {
        var courses = _context.Courses.Include(x => x.Department).AsNoTracking();

        if (!string.IsNullOrEmpty(request.FilterAttribute) && !string.IsNullOrEmpty(request.FilterValue))
        {
            switch (request.FilterAttribute)
            {
                case "courseCode":
                    courses = courses.Where(x => x.CourseCode.ToLower().Contains(request.FilterValue));
                    break;
                case "courseName":
                    courses = courses.Where(x => x.CourseName.ToLower().Contains(request.FilterValue));
                    break;
                case "departmentName":
                    courses = courses.Where(x => x.Department.ShortName.ToLower().Contains(request.FilterValue));
                    break;
                case "credit":
                    if (int.TryParse(request.FilterValue, out int credit))
                    {
                        courses = courses.Where(x => x.Credit == credit);
                    }                  
                    break;
                case "fee":
                    if (int.TryParse(request.FilterValue, out int fee))
                    {
                        courses = courses.Where(x => x.Fee == fee);
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
                case "courseCode":
                    courses = orderBy[1] == "Ascending" ? courses.OrderBy(x => x.CourseCode) : courses.OrderByDescending(x => x.CourseCode);
                    break;
                case "courseName":
                    courses = orderBy[1] == "Ascending" ? courses.OrderBy(x => x.CourseName) : courses.OrderByDescending(x => x.CourseName);
                    break;
                case "departmentName":
                    courses = orderBy[1] == "Ascending" ? courses.OrderBy(x => x.Department.ShortName) : courses.OrderByDescending(x => x.Department.ShortName);
                    break;
                case "credit":
                    courses = orderBy[1] == "Ascending" ? courses.OrderBy(x => x.Credit) : courses.OrderByDescending(x => x.Credit);
                    break;
                case "fee":
                    courses = orderBy[1] == "Ascending" ? courses.OrderBy(x => x.Fee) : courses.OrderByDescending(x => x.Fee);
                    break;
                default:
                    break;
            }
        }
        else
        {
            courses = courses.OrderByDescending(x => x.Id);
        }

        courses = courses.Skip(request.Skip);
        if (request.Take > 0)
        {
            courses.Take(request.Take);
        }

        var result = await courses
            .ProjectTo<CourseResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new CourseDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

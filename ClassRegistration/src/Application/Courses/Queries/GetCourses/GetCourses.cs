using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Common.Models;
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
        int totalCount = 0;

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
                default:
                    break;
            }
        }
        else
        {
            courses = courses.OrderByDescending(x => x.Id);
        }

        courses = courses.Skip(request.Skip).Take(request.Take);

        var result = await courses
            .ProjectTo<CourseResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        if (string.IsNullOrEmpty(request.FilterAttribute) && string.IsNullOrEmpty(request.FilterValue))
        {
            totalCount = await _context.Courses.CountAsync(cancellationToken);
        }
        else
        {
            totalCount = result.Count;
        }

        return new CourseDto
        {
            Result = result,
            Count = totalCount
        };
    }
}

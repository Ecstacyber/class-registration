using ClassRegistration.Application.Classes.Queries.GetClasses;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisite;

namespace ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisiteByCourseId;

public record GetCoursePrerequisiteByCourseIdQuery : IRequest<PrerequisiteCourseDto>
{
    public int CourseId { get; set; }
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterAttribute { get; set; }
    public string? FilterValue { get; set; }
}

public class GetCoursePrerequisiteByCourseIdQueryValidator : AbstractValidator<GetCoursePrerequisiteByCourseIdQuery>
{
    public GetCoursePrerequisiteByCourseIdQueryValidator()
    {
    }
}

public class GetCoursePrerequisiteByCourseIdQueryHandler : IRequestHandler<GetCoursePrerequisiteByCourseIdQuery, PrerequisiteCourseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCoursePrerequisiteByCourseIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PrerequisiteCourseDto> Handle(GetCoursePrerequisiteByCourseIdQuery request, CancellationToken cancellationToken)
    {
        var prerequisiteCourses = _context.PrerequisiteCourses
            .AsNoTracking()
            .Include(x => x.Prerequisite)
            .Where(x => x.CourseId == request.CourseId);

        if (!string.IsNullOrEmpty(request.FilterAttribute) && !string.IsNullOrEmpty(request.FilterValue))
        {
            switch (request.FilterAttribute)
            {
                case "prerequisiteCourseId":
                    prerequisiteCourses = prerequisiteCourses.Where(x => x.Prerequisite.CourseCode.ToLower().Contains(request.FilterValue) || x.Prerequisite.CourseName.ToLower().Contains(request.FilterValue));
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
                case "prerequisiteCourseId":
                    prerequisiteCourses = orderBy[1] == "Ascending" ? prerequisiteCourses.OrderBy(x => x.Prerequisite.CourseCode) : prerequisiteCourses.OrderByDescending(x => x.Prerequisite.CourseCode);
                    break;
                default:
                    break;
            }
        }
        else
        {
            prerequisiteCourses = prerequisiteCourses.OrderByDescending(x => x.Id);
        }

        prerequisiteCourses = prerequisiteCourses.Skip(request.Skip);
        if (request.Take > 0)
        {
            prerequisiteCourses.Take(request.Take);
        }

        var result = await prerequisiteCourses
            .ProjectTo<PrerequisiteCoursesResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PrerequisiteCourseDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

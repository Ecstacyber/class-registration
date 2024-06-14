using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Courses.Queries.GetCourses;

namespace ClassRegistration.Application.Courses.Queries.GetCourseById;

public record GetCourseByIdQuery : IRequest<CourseResult>
{
    public int CourseId { get; set; }
}

public class GetCourseByIdQueryValidator : AbstractValidator<GetCourseByIdQuery>
{
    public GetCourseByIdQueryValidator()
    {
    }
}

public class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, CourseResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCourseByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CourseResult> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        var course = await _context.Courses
            .Include(x => x.Department)
            .FirstOrDefaultAsync(x => x.Id == request.CourseId);

        return _mapper.Map<CourseResult>(course);
    }
}

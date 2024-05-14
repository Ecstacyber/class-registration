using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Courses.Queries.GetCourses;

public record GetCoursesQuery : IRequest<IEnumerable<CourseDto>>
{
}

public class GetCoursesQueryValidator : AbstractValidator<GetCoursesQuery>
{
    public GetCoursesQueryValidator()
    {
    }
}

public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, IEnumerable<CourseDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCoursesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CourseDto>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Courses
            .AsNoTracking()
            .ProjectTo<CourseDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}

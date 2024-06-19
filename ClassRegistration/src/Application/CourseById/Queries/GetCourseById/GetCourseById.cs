using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.CourseById.Queries.GetCourseById;

public record GetCourseByIdQuery : IRequest<CourseByIdDto?>
{
    public int Id { get; set; }
}

public class GetCourseByIdQueryValidator : AbstractValidator<GetCourseByIdQuery>
{
    public GetCourseByIdQueryValidator()
    {
    }
}

public class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, CourseByIdDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCourseByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CourseByIdDto?> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {      
        var course = await _context.Courses
            .AsNoTracking()
            .ProjectTo<CourseByIdDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        return course;
    }
}

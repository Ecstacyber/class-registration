using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisite;

public record GetCoursePrerequisiteQuery : IRequest<PrerequisiteCourseDto>
{
}

public class GetCoursePrerequisiteQueryValidator : AbstractValidator<GetCoursePrerequisiteQuery>
{
    public GetCoursePrerequisiteQueryValidator()
    {
    }
}

public class GetCoursePrerequisiteQueryHandler : IRequestHandler<GetCoursePrerequisiteQuery, PrerequisiteCourseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCoursePrerequisiteQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PrerequisiteCourseDto> Handle(GetCoursePrerequisiteQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.PrerequisiteCourses
            .ProjectTo<PrerequisiteCoursesResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PrerequisiteCourseDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisite;

public record GetCoursePrerequisiteQuery : IRequest<IEnumerable<PrerequisiteCourseDto>>
{
}

public class GetCoursePrerequisiteQueryValidator : AbstractValidator<GetCoursePrerequisiteQuery>
{
    public GetCoursePrerequisiteQueryValidator()
    {
    }
}

public class GetCoursePrerequisiteQueryHandler : IRequestHandler<GetCoursePrerequisiteQuery, IEnumerable<PrerequisiteCourseDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCoursePrerequisiteQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PrerequisiteCourseDto>> Handle(GetCoursePrerequisiteQuery request, CancellationToken cancellationToken)
    {
        return await _context.PrerequisiteCourses
            .ProjectTo<PrerequisiteCourseDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}

using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.RegistrationSchedules.Queries.GetRegistrationSchedules;

namespace ClassRegistration.Application.UserClasses.Queries.GetUserClassByRegScheduleId;

public record GetUserClassByRegScheduleIdQuery : IRequest<UserClassDto>
{
    public int? CourseId { get; set; }
    public int ClassId { get; set; }
    public int RegistrationScheduleId { get; set; }
    public int? Skip { get; set; }
    public int? Top { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterParams { get; set; }
    public string? FilterValue { get; set; }
}

public class GetUserClassByRegScheduleIdQueryValidator : AbstractValidator<GetUserClassByRegScheduleIdQuery>
{
    public GetUserClassByRegScheduleIdQueryValidator()
    {
    }
}

public class GetUserClassByRegScheduleIdQueryHandler : IRequestHandler<GetUserClassByRegScheduleIdQuery, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUserClassByRegScheduleIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UserClassDto> Handle(GetUserClassByRegScheduleIdQuery request, CancellationToken cancellationToken)
    {
        var userClasses = _context.UserClasses
            .AsNoTracking()
            .Include(x => x.Class)
            .Include(x => x.RegistrationSchedule)
            .Where(x => x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationScheduleId);
      
        var result = await userClasses
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new UserClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

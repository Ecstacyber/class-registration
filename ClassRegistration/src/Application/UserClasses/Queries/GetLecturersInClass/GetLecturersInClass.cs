using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.UserClasses.Queries.GetLecturersInClass;

public record GetLecturersInClassQuery : IRequest<UserClassDto>
{
    public int ClassId { get; set; }
    public int RegistrationId { get; set; }
}

public class GetLecturersInClassQueryValidator : AbstractValidator<GetLecturersInClassQuery>
{
    public GetLecturersInClassQueryValidator()
    {
    }
}

public class GetLecturersInClassQueryHandler : IRequestHandler<GetLecturersInClassQuery, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetLecturersInClassQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UserClassDto> Handle(GetLecturersInClassQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.UserClasses
            .Include(x => x.User)
            .Where(x => x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationId && x.User != null && x.User.Roles.Contains("lecturer"))
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new UserClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

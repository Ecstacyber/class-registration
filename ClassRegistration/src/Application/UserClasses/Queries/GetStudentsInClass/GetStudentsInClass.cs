using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.UserClasses.Queries.GetStudentsInClass;

public record GetStudentsInClass : IRequest<UserClassDto>
{
    public int ClassId { get; set; }
    public int RegistrationId { get; set; }
}

public class GetUserInClassQueryValidator : AbstractValidator<GetStudentsInClass>
{
    public GetUserInClassQueryValidator()
    {
    }
}

public class GetUserInClassQueryHandler : IRequestHandler<GetStudentsInClass, UserClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUserInClassQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UserClassDto> Handle(GetStudentsInClass request, CancellationToken cancellationToken)
    {
        var result = await _context.UserClasses
            .Include(x => x.User)
            .Where(x => x.ClassId == request.ClassId && x.RegistrationScheduleId == request.RegistrationId && x.User != null && x.User.Roles.Contains("student"))
            .ProjectTo<UserClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new UserClassDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

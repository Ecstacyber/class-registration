using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.RegistrationSchedules.Queries.GetCurrentRegistrationSchedule;

public record GetCurrentRegistrationScheduleQuery : IRequest<CurrentRegScheduleDto>
{
}

public class GetCurrentRegistrationScheduleQueryValidator : AbstractValidator<GetCurrentRegistrationScheduleQuery>
{
    public GetCurrentRegistrationScheduleQueryValidator()
    {
    }
}

public class GetCurrentRegistrationScheduleQueryHandler : IRequestHandler<GetCurrentRegistrationScheduleQuery, CurrentRegScheduleDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCurrentRegistrationScheduleQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CurrentRegScheduleDto> Handle(GetCurrentRegistrationScheduleQuery request, CancellationToken cancellationToken)
    {
        return _mapper.Map<CurrentRegScheduleDto>
            (await _context.RegistrationSchedules.FirstOrDefaultAsync(x => x.StartDate <= DateTime.Now && x.EndDate >= DateTime.Now, cancellationToken));
    }
}

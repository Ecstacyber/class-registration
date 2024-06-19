using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.RegistrationSchedules.Queries.GetRegistrationSchedules;

namespace ClassRegistration.Application.RegistrationSchedules.Queries.GetScheduleById;

public record GetScheduleByIdQuery : IRequest<RegistrationScheduleResult>
{
    public int Id { get; set; }
}

public class GetScheduleByIdQueryValidator : AbstractValidator<GetScheduleByIdQuery>
{
    public GetScheduleByIdQueryValidator()
    {
    }
}

public class GetScheduleByIdQueryHandler : IRequestHandler<GetScheduleByIdQuery, RegistrationScheduleResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetScheduleByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RegistrationScheduleResult> Handle(GetScheduleByIdQuery request, CancellationToken cancellationToken)
    {
        return _mapper.Map<RegistrationScheduleResult>(await _context.RegistrationSchedules.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken));
    }
}

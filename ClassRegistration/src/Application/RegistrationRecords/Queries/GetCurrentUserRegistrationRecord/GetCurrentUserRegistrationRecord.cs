﻿using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.RegistrationRecords.Queries.GetCurrentUserRegistrationRecord;

public record GetCurrentUserRegistrationRecordQuery : IRequest<RegistrationRecordDto>
{
    public int UserId { get; set; }
}

public class GetCurrentUserRegistrationRecordQueryValidator : AbstractValidator<GetCurrentUserRegistrationRecordQuery>
{
    public GetCurrentUserRegistrationRecordQueryValidator()
    {
    }
}

public class GetCurrentUserRegistrationRecordQueryHandler : IRequestHandler<GetCurrentUserRegistrationRecordQuery, RegistrationRecordDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCurrentUserRegistrationRecordQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RegistrationRecordDto> Handle(GetCurrentUserRegistrationRecordQuery request, CancellationToken cancellationToken)
    {
        var currentRegWindow = await _context.RegistrationSchedules.FirstOrDefaultAsync(x => x.StartDate <= DateTime.Now && x.EndDate >= DateTime.Now);
        if (currentRegWindow != null)
        {
            var regRecords = await _context.RegistrationRecords
                .AsNoTracking()
                .Include(x => x.User)
                .Include(x => x.Class)
                .Include(x => x.RegistrationSchedule)
                .Where(x => x.RegistrationScheduleId == currentRegWindow.Id && x.UserId == request.UserId)
                .ProjectTo<RegistrationRecordResult>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return new RegistrationRecordDto
            {
                Result = regRecords,
                Count = regRecords.Count
            };
        }
        else
        {
            return new RegistrationRecordDto
            {
                Result = [],
                Count = 0
            };
        }
    }
}

using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.RegistrationSchedules.Queries.GetRegistrationSchedules;

namespace ClassRegistration.Application.RegistrationSchedules.Queries.GetPreviousSchedules;

public record GetPreviousSchedulesQuery : IRequest<RegistrationScheduleDto>
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterAttribute { get; set; }
    public string? FilterValue { get; set; }
    public string? FilterOperator { get; set; }
}

public class GetPreviousSchedulesQueryValidator : AbstractValidator<GetPreviousSchedulesQuery>
{
    public GetPreviousSchedulesQueryValidator()
    {
    }
}

public class GetPreviousSchedulesQueryHandler : IRequestHandler<GetPreviousSchedulesQuery, RegistrationScheduleDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPreviousSchedulesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    private static string DecodeUrlString(string url)
    {
        string newUrl;
        while ((newUrl = Uri.UnescapeDataString(url)) != url)
            url = newUrl;
        return newUrl;
    }

    public async Task<RegistrationScheduleDto> Handle(GetPreviousSchedulesQuery request, CancellationToken cancellationToken)
    {
        var registrationSchedules = _context.RegistrationSchedules.AsNoTracking().Where(x => x.EndDate < DateTime.Now);

        if (!string.IsNullOrEmpty(request.FilterAttribute) && !string.IsNullOrEmpty(request.FilterValue))
        {
            switch (request.FilterAttribute)
            {
                case "name":
                    registrationSchedules = registrationSchedules.Where(x => x.Name.Contains(request.FilterValue));
                    break;
                case "startDate":
                    var requestStartDate = DecodeUrlString(request.FilterValue);
                    switch (request.FilterOperator)
                    {
                        case "equal":
                            if (DateTime.TryParse(requestStartDate, out DateTime equalDate))
                                registrationSchedules = registrationSchedules.Where(x => x.StartDate == equalDate);
                            break;
                        case "notEqual":
                            if (DateTime.TryParse(requestStartDate, out DateTime notEqualDate))
                                registrationSchedules = registrationSchedules.Where(x => x.StartDate != notEqualDate);
                            break;
                        case "greaterThan":
                            if (DateTime.TryParse(requestStartDate, out DateTime greaterThanDate))
                                registrationSchedules = registrationSchedules.Where(x => x.StartDate > greaterThanDate);
                            break;
                        case "lessThan":
                            if (DateTime.TryParse(requestStartDate, out DateTime lessThanDate))
                                registrationSchedules = registrationSchedules.Where(x => x.StartDate < lessThanDate);
                            break;
                        default:
                            break;
                    }
                    break;
                case "endDate":
                    var requestEndDate = DecodeUrlString(request.FilterValue);
                    switch (request.FilterOperator)
                    {
                        case "equal":
                            if (DateTime.TryParse(request.FilterValue, out DateTime equalDate))
                                registrationSchedules = registrationSchedules.Where(x => x.EndDate == equalDate);
                            break;
                        case "notEqual":
                            if (DateTime.TryParse(request.FilterValue, out DateTime notEqualDate))
                                registrationSchedules = registrationSchedules.Where(x => x.EndDate != notEqualDate);
                            break;
                        case "greaterThan":
                            if (DateTime.TryParse(request.FilterValue, out DateTime greaterThanDate))
                                registrationSchedules = registrationSchedules.Where(x => x.EndDate > greaterThanDate);
                            break;
                        case "lessThan":
                            if (DateTime.TryParse(request.FilterValue, out DateTime lessThanDate))
                                registrationSchedules = registrationSchedules.Where(x => x.EndDate < lessThanDate);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        }

        if (!string.IsNullOrEmpty(request.OrderBy))
        {
            var orderBy = request.OrderBy.Split('-');
            switch (orderBy[0])
            {
                case "name":
                    registrationSchedules = orderBy[1] == "Ascending" ? registrationSchedules.OrderBy(x => x.Name) : registrationSchedules.OrderByDescending(x => x.Name);
                    break;
                default:
                    break;
            }
        }
        else
        {
            registrationSchedules = registrationSchedules.OrderByDescending(x => x.Id);
        }

        registrationSchedules = registrationSchedules.Skip(request.Skip);
        if (request.Take > 0)
        {
            registrationSchedules.Take(request.Take);
        }

        var result = await registrationSchedules
            .ProjectTo<RegistrationScheduleResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new RegistrationScheduleDto
        {
            Result = result,
            Count = result.Count
        };
    }
}

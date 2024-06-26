﻿using System.Linq;
using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.RegistrationSchedules.Queries.GetRegistrationSchedules;

public record GetRegistrationSchedulesQuery : IRequest<RegistrationScheduleDto>
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterAttribute { get; set; }
    public string? FilterValue { get; set; }
    public string? FilterOperator { get; set; }
}

public class GetRegistrationScheduleQueryValidator : AbstractValidator<GetRegistrationSchedulesQuery>
{
    public GetRegistrationScheduleQueryValidator()
    {
    }
}

public class GetRegistrationScheduleQueryHandler : IRequestHandler<GetRegistrationSchedulesQuery, RegistrationScheduleDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRegistrationScheduleQueryHandler(IApplicationDbContext context, IMapper mapper)
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

    public async Task<RegistrationScheduleDto> Handle(GetRegistrationSchedulesQuery request, CancellationToken cancellationToken)
    {
        var registrationSchedules = _context.RegistrationSchedules.AsNoTracking();

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
            registrationSchedules = registrationSchedules.OrderBy(x => x.EndDate);
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

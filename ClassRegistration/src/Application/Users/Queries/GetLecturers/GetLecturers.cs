﻿using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Users.Queries.GetLecturers;

public record GetLecturersQuery : IRequest<UserTableDataDto>
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterAttribute { get; set; }
    public string? FilterValue { get; set; }
}

public class GetLecturersQueryValidator : AbstractValidator<GetLecturersQuery>
{
    public GetLecturersQueryValidator()
    {
    }
}

public class GetLecturersQueryHandler : IRequestHandler<GetLecturersQuery, UserTableDataDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;

    public GetLecturersQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
    }

    public async Task<UserTableDataDto> Handle(GetLecturersQuery request, CancellationToken cancellationToken)
    {
        if (request.Take == 0)
        {
            return new UserTableDataDto
            {
                Result = [],
                Count = 0
            };
        }

        var humans = _context.Humans.Include(x => x.Department).AsNoTracking();

        if (!string.IsNullOrEmpty(request.FilterAttribute) && !string.IsNullOrEmpty(request.FilterValue))
        {
            switch (request.FilterAttribute)
            {
                //case "userCode":
                //    humans = humans.Where(x => x.UserCode.ToLower().Contains(request.FilterValue));
                //    break;
                case "userName":
                    humans = humans.Where(x => x.UserName.ToLower().Contains(request.FilterValue));
                    break;
                case "departmentId":
                    humans = humans.Where(x => x.Department.ShortName.ToLower().Contains(request.FilterValue));
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
                case "userCode":
                    humans = orderBy[1] == "Ascending" ? humans.OrderBy(x => x.UserCode) : humans.OrderByDescending(x => x.UserCode);
                    break;
                case "userName":
                    humans = orderBy[1] == "Ascending" ? humans.OrderBy(x => x.UserName) : humans.OrderByDescending(x => x.UserName);
                    break;
                case "departmentId":
                    humans = orderBy[1] == "Ascending" ? humans.OrderBy(x => x.Department.ShortName) : humans.OrderByDescending(x => x.Department.ShortName);
                    break;
                default:
                    break;
            }
        }
        else
        {
            humans = humans.OrderByDescending(x => x.Id);
        }

        //humans = humans.Skip(request.Skip).Take(request.Take);

        var humansDto = await humans
            .ProjectTo<UserResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        List<UserResult> results = new List<UserResult>();
        foreach (var human in humansDto)
        {
            var role = await _identityService.GetUserRoleAsync(human.Id);
            if (role.Contains("Lecturer"))
            {
                results.Add(human);
            }
        }
        results.Skip(request.Skip).Take(request.Take);

        return new UserTableDataDto
        {
            Result = results,
            Count = results.Count
        };
    }
}

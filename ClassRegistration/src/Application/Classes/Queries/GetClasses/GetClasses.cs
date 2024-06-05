﻿using System.Collections.Generic;
using System.Security.Authentication;
using System.Text.Json.Serialization;
using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Courses.Queries.GetCourses;

namespace ClassRegistration.Application.Classes.Queries.GetClasses;

public record GetClassesQuery : IRequest<ClassDto>
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterAttribute { get; set; }
    public string? FilterValue { get; set; }
}

public class GetClassesQueryValidator : AbstractValidator<GetClassesQuery>
{
    public GetClassesQueryValidator()
    {
    }
}

public class GetClassesQueryHandler : IRequestHandler<GetClassesQuery, ClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClassesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
   
    public async Task<ClassDto> Handle(GetClassesQuery request, CancellationToken cancellationToken)
    {      
        var classes = _context.Classes
            .Include(x => x.Course)
            .Include(x => x.UserClasses)
            .Include(x => x.ClassType)
            .AsNoTracking();

        if (!string.IsNullOrEmpty(request.FilterAttribute) && !string.IsNullOrEmpty(request.FilterValue))
        {
            switch (request.FilterAttribute)
            {
                case "classCode":
                    classes = classes.Where(x => x.ClassCode.Contains(request.FilterValue));
                    break;
                case "course.courseName":
                    classes = classes.Where(x => x.Course.CourseName.ToLower().Contains(request.FilterValue));
                    break;
                case "classType":
                    classes = classes.Where(x => x.ClassType.Type == request.FilterValue);
                    break;
                case "dayOfWeek":
                    if (int.TryParse(request.FilterValue, out int day))
                    {
                        classes = classes.Where(x => x.DayOfWeek == day);
                    }
                    break;
                case "startPeriod":
                    if (int.TryParse(request.FilterValue, out int startPeriod))
                    {
                        classes = classes.Where(x => x.StartPeriod == startPeriod);
                    }
                    break;
                case "endPeriod":
                    if (int.TryParse(request.FilterValue, out int endPeriod))
                    {
                        classes = classes.Where(x => x.EndPeriod == endPeriod);
                    }
                    break;
                case "capacity":
                    if (int.TryParse(request.FilterValue, out int capacity))
                    {
                        classes = classes.Where(x => x.Capacity == capacity);
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
                case "classCode":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.ClassCode) : classes.OrderByDescending(x => x.ClassCode);
                    break;
                case "course.courseName":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.Course.CourseName) : classes.OrderByDescending(x => x.Course.CourseName);
                    break;
                case "dayOfWeek":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.DayOfWeek) : classes.OrderByDescending(x => x.DayOfWeek);
                    break;
                case "startPeriod":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.StartPeriod) : classes.OrderByDescending(x => x.StartPeriod);
                    break;
                case "endPeriod":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.EndPeriod) : classes.OrderByDescending(x => x.EndPeriod);
                    break;
                case "capacity":
                    classes = orderBy[1] == "Ascending" ? classes.OrderBy(x => x.Capacity) : classes.OrderByDescending(x => x.Capacity);
                    break;
                default:
                    break;
            }
        }
        else
        {
            classes = classes.OrderByDescending(x => x.Id);
        }

        classes = classes.Skip(request.Skip);
        if (request.Take > 0)
        {
            classes.Take(request.Take);
        }

        var results = await classes
            .ProjectTo<ClassResult>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        var departments = await _context.Departments.AsNoTracking().Include(x => x.Courses).ToListAsync(cancellationToken);
        foreach (var result in results)
        {
            foreach (var department in departments)
            {
                foreach (var course in department.Courses)
                {
                    if (course.Id == result.CourseId)
                    {
                        result.DepartmentName = department.ShortName;
                        break;
                    }
                }
            }
        }


        return new ClassDto
        {
            Result = results,
            Count = results.Count
        };
    }
}

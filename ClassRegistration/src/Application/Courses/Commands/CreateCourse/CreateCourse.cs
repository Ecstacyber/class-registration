using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Courses.Commands.CreateCourse;

public record CreateCourseCommand : IRequest<int>
{
    public int DepartmentId { get; init; }
    public required string CourseCode { get; init; }
    public required string CourseName { get; init; }
    public string? Description { get; init; }
}

public class CreateCourseCommandValidator : AbstractValidator<CreateCourseCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateCourseCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(x => x.CourseCode)
            .NotEmpty()
            .MaximumLength(10)
            .MustAsync(BeUniqueCourseCode)
                .WithMessage("'{PropertyName}' must be unique.")
                .WithErrorCode("Unique");

        RuleFor(x => x.DepartmentId)
            .MustAsync(ExistedDepartmentId)
                .WithMessage("'{PropertyName}' must exist.")
                .WithErrorCode("NotFound");
    }

    private async Task<bool> BeUniqueCourseCode(string courseCode, CancellationToken token)
    {
        return await _context.Courses.AllAsync(x => x.CourseCode != courseCode, token);
    }

    private async Task<bool> ExistedDepartmentId(int departmentId, CancellationToken token)
    {
        return await _context.Departments.AnyAsync(x => x.Id == departmentId, token);
    }
}

public class CreateCourseCommandHandler : IRequestHandler<CreateCourseCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateCourseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {
        var entity = new Course
        {
            CourseCode = request.CourseCode,
            CourseName = request.CourseName,
            Description = request.Description,
            DepartmentId = request.DepartmentId
        };
        _context.Courses.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

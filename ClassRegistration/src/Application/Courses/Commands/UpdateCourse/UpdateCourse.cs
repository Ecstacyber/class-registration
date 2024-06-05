using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Courses.Commands.UpdateCourse;

public record UpdateCourseCommand : IRequest
{
    public int Id { get; init; }
    public int DepartmentId { get; init; }
    public required string CourseCode { get; init; }
    public required string CourseName { get; init; }
    public required int Credit { get; init; }
    public required long Fee { get; init; }
    public string? Description { get; init; }
}

public class UpdateCourseCommandValidator : AbstractValidator<UpdateCourseCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCourseCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        //RuleFor(x => x.CourseCode)
        //    .NotEmpty()
        //    .MaximumLength(10)
        //    .MustAsync(BeUniqueCourseCode)
        //        .When(x => x.Id != 0)
        //        .WithMessage("'{PropertyName}' must be unique.")
        //        .WithErrorCode("Unique");

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

public class UpdateCourseCommandHandler : IRequestHandler<UpdateCourseCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCourseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Courses.FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.DepartmentId = request.DepartmentId;
        entity.CourseCode = request.CourseCode;
        entity.CourseName = request.CourseName;
        entity.Credit = request.Credit;
        entity.Fee = request.Fee;
        entity.Description = request.Description;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

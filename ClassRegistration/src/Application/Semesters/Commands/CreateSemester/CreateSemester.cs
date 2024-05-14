using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Semesters.Commands.CreateSemester;

public record CreateSemesterCommand : IRequest<int>
{
    public int StartYear { get; init; }
    public int EndYear { get; init; }
    public int Split { get; init; }
}

public class CreateSemesterCommandValidator : AbstractValidator<CreateSemesterCommand>
{
    public CreateSemesterCommandValidator()
    {
    }
}

public class CreateSemesterCommandHandler : IRequestHandler<CreateSemesterCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateSemesterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateSemesterCommand request, CancellationToken cancellationToken)
    {
        var entity = new Semester
        {
            StartYear = request.StartYear,
            EndYear = request.EndYear,
            Split = request.Split
        };

        _context.Semesters.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}

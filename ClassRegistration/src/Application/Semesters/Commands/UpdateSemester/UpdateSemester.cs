using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Application.Semesters.Commands.UpdateSemester;

public record UpdateSemesterCommand : IRequest
{
    public int Id { get; init; }
    public int StartYear { get; init; }
    public int EndYear { get; init; }
    public int Split { get; init; }
}

public class UpdateSemesterCommandValidator : AbstractValidator<UpdateSemesterCommand>
{
    public UpdateSemesterCommandValidator()
    {
    }
}

public class UpdateSemesterCommandHandler : IRequestHandler<UpdateSemesterCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateSemesterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateSemesterCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Semesters.FindAsync([request.Id], cancellationToken);
        Guard.Against.NotFound(request.Id, entity);

        entity.StartYear = request.StartYear;
        entity.EndYear = request.EndYear;
        entity.Split = request.Split;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Departments.Queries.GetDepartments;

public class DepartmentDto
{
    public IReadOnlyCollection<Result> Result { get; init; } = Array.Empty<Result>();
    public IReadOnlyCollection<Items> Items { get; init; } = Array.Empty<Items>();
    public int Count { get; init; }
}

using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Classes.Queries.GetClasses;
public class ClassDto
{
    public IReadOnlyCollection<ClassResult> Result { get; set; } = new List<ClassResult>();
    public int Count { get; set; }
}

namespace ClassRegistration.Domain.Entities;

public class Department : BaseAuditableEntity
{
    public string? ShortName { get; set; }
    public string? FullName { get; set; }
    public string? Description { get; set; }
    public IList<Course> Courses { get; private set; } = new List<Course>();
}

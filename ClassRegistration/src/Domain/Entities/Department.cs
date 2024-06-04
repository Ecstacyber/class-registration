namespace ClassRegistration.Domain.Entities;

public class Department : BaseAuditableEntity
{
    public required string ShortName { get; set; }
    public required string FullName { get; set; }
    public string? Description { get; set; }
    public User? User { get; set; }
    public IList<Course> Courses { get; private set; } = new List<Course>();
}

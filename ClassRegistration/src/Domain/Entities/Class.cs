namespace ClassRegistration.Domain.Entities;

public class Class : BaseAuditableEntity
{
    public int? CourseId { get; set; }
    public int? ClassTypeId { get; set; }
    public required string ClassCode { get; set; }
    public int DayOfWeek { get; set; }
    public int StartPeriod { get; set; }
    public int EndPeriod { get; set; }
    public int Capacity { get; set; }
    public bool CanBeRegistered { get; set; }
    public Course Course { get; set; } = null!;
    public ClassType ClassType { get; set; } = null!;
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
}

namespace ClassRegistration.Domain.Entities;

public class Class : BaseAuditableEntity
{
    public int CourseId { get; set; }
    public string? ClassCode { get; set; }
    public string? Fee { get; set; }
    public int Credit { get; set; }
    public int DayOfWeek { get; set; }
    public int StartPeriod { get; set; }
    public int EndPeriod { get; set; }
    public Course Course { get; set; } = null!;
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
}

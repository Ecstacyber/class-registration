namespace ClassRegistration.Domain.Entities;

public class Semester : BaseAuditableEntity
{
    public int StartYear { get; set; }
    public int EndYear { get; set; }
    public int Split { get; set; }
    public ICollection<RegistrationSchedule> RegistrationSchedules { get; set; } = new List<RegistrationSchedule>();
}

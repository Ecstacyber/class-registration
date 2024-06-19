namespace ClassRegistration.Domain.Entities;

public class UserClass : BaseAuditableEntity
{
    public int ClassId { get; set; }
    public int RegistrationScheduleId { get; set; }
    public int UserId { get; set; }
    public bool Passed { get; set; }
    public Class Class { get; set; } = null!;
    public RegistrationSchedule? RegistrationSchedule { get; set; }
    public User User { get; set; } = null!;
}

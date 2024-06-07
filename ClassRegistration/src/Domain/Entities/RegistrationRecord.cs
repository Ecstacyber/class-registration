namespace ClassRegistration.Domain.Entities;

public class RegistrationRecord : BaseAuditableEntity
{
    public int? ClassId { get; set; }
    public int? RegistrationScheduleId { get; set; }
    public int? UserId { get; set; }
    public string? RequestType { get; set; }
    public required string Result { get; set; }
    public string? Message { get; set; }
    public string? Dependency { get; set; }
    public Class? Class { get; set; }
    public RegistrationSchedule? RegistrationSchedule { get; set; }
    public User? User { get; set; }
}

namespace ClassRegistration.Domain.Entities;

public class TuitionFee : BaseAuditableEntity
{
    public long TotalFee { get; set; }
    public int? RegistrationScheduleId { get; set; }
    public RegistrationSchedule? RegistrationSchedule { get; set; }
}

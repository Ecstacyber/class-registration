namespace ClassRegistration.Domain.Entities;

public class TuitionFee : BaseAuditableEntity
{
    public long TotalFee { get; set; }
    public int SemesterId { get; set; }
    public Semester? Semester { get; set; }
    public User? User { get; set; } 
}

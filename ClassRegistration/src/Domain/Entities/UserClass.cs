namespace ClassRegistration.Domain.Entities;

public class UserClass : BaseAuditableEntity
{
    public int ClassId { get; set; }
    public int SemesterId { get; set; }
    public bool Passed { get; set; }
    public Class? Class { get; set; }
    public Semester? Semester { get; set; }
}

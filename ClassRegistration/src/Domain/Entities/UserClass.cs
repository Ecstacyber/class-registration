namespace ClassRegistration.Domain.Entities;

public class UserClass : BaseAuditableEntity
{
    public int ClassId { get; set; }
    public Class? Class { get; set; }
}

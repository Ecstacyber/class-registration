namespace ClassRegistration.Domain.Entities;

public class Semester : BaseAuditableEntity
{
    public int StartYear { get; set; }
    public int EndYear { get; set; }
    public int Split { get; set; }
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
    public IList<TuitionFee> TuitionFees { get; set; } = new List<TuitionFee>();
}

using System.ComponentModel.DataAnnotations.Schema;

///Using to past user data to application layer
namespace ClassRegistration.Domain.Entities;

public class User : BaseAuditableEntity
{
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
    public IList<TuitionFee> TuitionFee { get; set; } = new List<TuitionFee>();
    public IList<string> Roles { get; set; } = new List<string>();
}

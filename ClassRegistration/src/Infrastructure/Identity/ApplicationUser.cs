using ClassRegistration.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ClassRegistration.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
    public IList<TuitionFee> TuitionFee { get; set; } = new List<TuitionFee>();
}

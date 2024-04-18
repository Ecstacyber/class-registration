using ClassRegistration.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ClassRegistration.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
}

using ClassRegistration.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ClassRegistration.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public int HumanId { get; set; }
    public User? Human { get; set; }

}

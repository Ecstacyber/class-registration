using Microsoft.AspNetCore.Identity;

namespace ClassRegistration.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? UserType { get; set; }
    }
}

using Microsoft.AspNetCore.Identity;

namespace ClassRegistration.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public required string NormalizedUserID { get; set; }
        public string? DepartmentId { get; set; }
        public ICollection<RegistrationInfo> RegistrationInfos { get; set; } = [];
    }
}

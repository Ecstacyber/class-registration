///Using to past user data to application layer
using ClassRegistration.Application.Common.Interfaces;

namespace ClassRegistration.Infrastructure.Identity;
public class User : IUser
{
    public string? Id { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public int? DepartmentId { get; set; }
    public List<string>? Roles { get; set; }
}

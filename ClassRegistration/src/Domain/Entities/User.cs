///Using to past user data to application layer
namespace ClassRegistration.Domain.Entities;

public class User
{
    public string? Id { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public int? DepartmentId { get; set; }
    public List<string>? Roles { get; set; }
}

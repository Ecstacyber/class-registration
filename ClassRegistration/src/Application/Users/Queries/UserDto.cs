using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Users.Queries;

public class UserDto
{
    public int Id { get; set; }
    public string? UserName { get; set; }
    public string? UserCode { get; set; }
    public string? Email { get; set; }
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public List<string>? Roles { get; set; }
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<User, UserDto>();
        }
    }
}

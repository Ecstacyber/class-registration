using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Departments.Queries.GetDepartments;

public class Items
{
    public int Id { get; set; }
    public string? ShortName { get; set; }
    public string? FullName { get; set; }
    public string? Description { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Department, Items>();
        }
    }
}

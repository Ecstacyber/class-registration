using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Departments.Queries.GetDepartments;

public class Result
{
    public int Id { get; set; }
    public string? ShortName { get; set; }
    public string? FullName { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Department, Result>();
        }
    }
}

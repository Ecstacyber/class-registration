using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Classes.Queries.GetClasses;
public class ClassDto
{
    public int CourseId { get; set; }
    public string? ClassCode { get; set; }
    public string? Fee { get; set; }
    public int Credit { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Class, ClassDto>();
        }
    }
}

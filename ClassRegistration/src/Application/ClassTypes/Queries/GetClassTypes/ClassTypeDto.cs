using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.ClassTypes.Queries.GetClassTypes;
public class ClassTypeDto
{
    public int ClassTypeId { get; set; }
    public required string Type { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ClassType, ClassTypeDto>();
        }
    }
}

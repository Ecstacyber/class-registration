using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.UserClasses.Queries.GetUserInClass;

public class UserClassDto
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public int SemesterId { get; set; }
    public bool Passed { get; set; }
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<UserClass, UserClassDto>();
        }
    }
}

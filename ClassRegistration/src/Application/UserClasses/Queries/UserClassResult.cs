using ClassRegistration.Application.Classes.Queries.GetClasses;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.UserClasses.Queries;

public class UserClassResult
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public int? RegistrationScheduleId { get; set; }
    public string? CourseName { get; set; }
    public string? DepartmentName { get; set; }
    public string? ClassType { get; set; }
    public bool? Passed { get; set; }
    public int UserClassCount { get; set; }
    public long Fee { get; set; }
    public Class Class { get; set; } = null!;
    public ClassResult? ClassResult { get; set; }
    public User? User { get; set; }
    public RegistrationSchedule RegistrationSchedule { get; set; } = null!;
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<UserClass, UserClassResult>();
        }
    }
}

using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.RegistrationRecords.Queries;

public class RegistrationRecordResult
{
    public int? ClassId { get; set; }
    public int? RegistrationScheduleId { get; set; }
    public int? UserId { get; set; }
    public string? CourseName { get; set; }
    public string? RequestType { get; set; }
    public required string Result { get; set; }
    public string? Message { get; set; }
    public string? Dependency { get; set; }
    public DateTimeOffset? Created { get; set; }
    public Class? Class { get; set; }
    public RegistrationSchedule? RegistrationSchedule { get; set; }
    public User? User { get; set; }
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<RegistrationRecord, RegistrationRecordResult>();
        }
    }
}

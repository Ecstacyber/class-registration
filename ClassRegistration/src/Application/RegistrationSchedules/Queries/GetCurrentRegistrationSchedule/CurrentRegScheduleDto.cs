using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.RegistrationSchedules.Queries.GetCurrentRegistrationSchedule;

public class CurrentRegScheduleDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int MaximumCredit { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<RegistrationSchedule, CurrentRegScheduleDto>();
        }
    }
}

using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.RegistrationSchedules.Queries.GetRegistrationSchedules;

public class RegistrationScheduleDto
{
    public IReadOnlyCollection<RegistrationScheduleResult> Result { get; set; } = new List<RegistrationScheduleResult>();
    public int Count { get; set; }
}

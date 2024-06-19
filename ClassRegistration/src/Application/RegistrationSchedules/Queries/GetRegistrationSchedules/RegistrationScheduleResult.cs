using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.RegistrationSchedules.Queries.GetRegistrationSchedules;

public class RegistrationScheduleResult
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
    public int MaximumCredit { get; set; }
    public int FeePerCredit { get; set; }
    //public IList<Class> Classes { get; set; } = new List<Class>();
    //public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
    public IList<TuitionFee> TuitionFees { get; set; } = new List<TuitionFee>();
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<RegistrationSchedule, RegistrationScheduleResult>();
        }
    }
}

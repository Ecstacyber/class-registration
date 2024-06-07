using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassRegistration.Domain.Entities;
public class RegistrationSchedule : BaseAuditableEntity
{
    public required string Name { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
    public int MaximumCredit { get; set; }
    public int FeePerCredit { get; set; }
    public IList<Class> Classes { get; set; } = new List<Class>();
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
    public IList<TuitionFee> TuitionFees { get; set; } = new List<TuitionFee>();
    public IList<RegistrationRecord> RegistrationRecords { get; set; } = new List<RegistrationRecord>();
}

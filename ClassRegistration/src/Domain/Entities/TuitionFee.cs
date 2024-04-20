using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassRegistration.Domain.Entities;
public class TuitionFee : BaseAuditableEntity
{
    public long TotalFee { get; set; }
    public int SemesterId { get; set; }
    public Semester? Semester { get; set; }
}

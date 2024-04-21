using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassRegistration.Domain.Entities;
public class Class : BaseAuditableEntity
{
    public int CourseId { get; set; }
    public string? ClassCode { get; set; }
    public string? Fee { get; set; }
    public int Credit { get; set; }
    public Course Course { get; set; } = null!;
    public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
}

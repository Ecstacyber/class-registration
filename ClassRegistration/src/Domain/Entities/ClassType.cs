using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassRegistration.Domain.Entities;
public class ClassType : BaseAuditableEntity
{
    public required string Type { get; set; }
    public IList<Class> Class { get; set; } = new List<Class>();
}

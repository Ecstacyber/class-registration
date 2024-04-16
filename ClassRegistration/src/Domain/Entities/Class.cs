using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassRegistration.Domain.Entities;
public class Class
{
    public int CourseId { get; set; }
    public string? ClassCode { get; set; }
    public Course Course { get; set; } = null!;
}

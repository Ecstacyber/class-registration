namespace ClassRegistration.Domain.Entities;

public class Course : BaseAuditableEntity
{
    public int DepartmentId { get; set; }
    public string? CourseCode { get; set; }
    public string? CourseName { get; set; }
    public string? Description { get; set; }  
    public Department Department { get; set; } = null!;
    public IList<Class> Classes { get; set; } = new List<Class>();
}

namespace ClassRegistration.Domain.Entities;

public class Course : BaseAuditableEntity
{
    public int DepartmentId { get; set; }
    public string? CourseCode { get; set; }
    public string? CourseName { get; set; }
    public string? Description { get; set; }  
    public Department Department { get; set; } = null!;
    public IList<Class> Classes { get; set; } = new List<Class>();
    public IList<PrerequisiteCourse> Current { get; set; } = new List<PrerequisiteCourse>();
    public IList<PrerequisiteCourse> Prerequisites { get; set; } = new List<PrerequisiteCourse>();
}

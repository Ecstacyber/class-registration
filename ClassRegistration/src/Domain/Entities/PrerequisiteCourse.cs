namespace ClassRegistration.Domain.Entities;

public class PrerequisiteCourse : BaseAuditableEntity
{
    public int? CourseId { get; set; }
    public int? PrerequisiteCourseId { get; set; }
    public bool RequirePassed { get; set; } = true;
    public Course Course { get; set; } = null!;
    public Course Prerequisite { get; set; } = null!;
}

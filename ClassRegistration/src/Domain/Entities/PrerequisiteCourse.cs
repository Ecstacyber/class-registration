namespace ClassRegistration.Domain.Entities;

public class PrerequisiteCourse : BaseAuditableEntity
{
    public int? CourseId { get; set; }
    public int? PrerequisiteCourseId { get; set; }
    public bool RequirePassed { get; set; }
    public Course? Course { get; set; }
    public Course? Prerequisite { get; set; }
}

using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisite;
public class PrerequisiteCourseDto
{
    public IReadOnlyCollection<PrerequisiteCoursesResult> Result { get; set; } = new List<PrerequisiteCoursesResult>();
    public int Count { get; set; }
}

using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Courses.Queries.GetCoursesFK;

public class CoursesFKDto
{
    public int PrerequisiteCourseId { get; set; }
    public required string CourseName { get; set; }
    public required long Fee { get; set; }
    public required int Credit { get; set; }
    public string? Description { get; set; }
    public Department? Department { get; set; }
}

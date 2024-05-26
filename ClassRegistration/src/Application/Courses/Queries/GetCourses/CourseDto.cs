using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Courses.Queries.GetCourses;
public class CourseDto
{
    public List<CourseResult> Result { get; set; } = new List<CourseResult>();
    public int Count { get; set; }
}

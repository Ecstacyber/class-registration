using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Courses.Queries.GetCourses;

public class CourseResult
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public required string CourseCode { get; set; }
    public required string CourseName { get; set; }
    public string? Description { get; set; }
    public Department? Department { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Course, CourseResult>();
        }
    }
}

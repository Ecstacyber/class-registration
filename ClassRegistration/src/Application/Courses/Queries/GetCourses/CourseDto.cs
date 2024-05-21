using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Courses.Queries.GetCourses;
public class CourseDto
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string? CourseCode { get; set; }
    public string? CourseName { get; set; }
    public string? Description { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Course, CourseDto>();
        }
    }
}

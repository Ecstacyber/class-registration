using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.CourseById.Queries.GetCourseById;
public class CourseByIdDto
{
    public int Id { get; set; }
    public required string CourseCode { get; set; }
    public required string CourseName { get; set; }
    public required int Credit { get; set; }
    public required long Fee { get; set; }
    public string? Description { get; set; }
    public Department? Department { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Course, CourseByIdDto>();
        }
    }
}

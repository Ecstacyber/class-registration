using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.PrerequisiteCourses.Queries.GetCoursePrerequisite;

public class PrerequisiteCoursesResult
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public Course? Course { get; set; }
    public int PrerequisiteCourseId { get; set; }
    public Course? Prerequisite { get; set; }
    public bool RequirePassed { get; set; }
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<PrerequisiteCourse, PrerequisiteCoursesResult>();
        }
    }
}

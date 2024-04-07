namespace ClassRegistration.Server.Models
{
    public class PrerequisiteCourseInfo
    {
        public required string Id { get; set; }
        public required string CourseId { get; set; }
        public required string PrerequisiteCourseId { get; set; }
    }
}

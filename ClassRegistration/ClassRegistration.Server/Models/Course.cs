using System.Data.SqlTypes;

namespace ClassRegistration.Server.Models
{
    public class Course
    {
        public required string Id { get; set; }
        public required string ShortName { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; } = null;
        public SqlMoney? Fee { get; set; } = 0;
        public ICollection<Class> Classes { get; set; } = [];
        public ICollection<PrerequisiteCourseInfo>? PrerequisiteCourseInfos { get; set; } = [];
    }
}

namespace ClassRegistration.Server.Models
{
    public class Department
    {
        public required string? Id { get; set; }
        public required string ShortName { get; set; }
        public required string FullName { get; set; }
        public string? Description { get; set; } = null;
        public ICollection<ApplicationUser> Users { get; set; } = [];
        public ICollection<Course> Courses { get; set; } = [];
    }
}

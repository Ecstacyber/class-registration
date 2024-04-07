namespace ClassRegistration.Server.Models
{
    public class Semester
    {
        public required string Id { get; set; }
        public required string StartYear { get; set; }
        public required string EndYear { get; set; }
        public required int Split { get; set; }
        public ICollection<RegistrationInfo> RegistrationInfos { get; set; } = [];
    }
}

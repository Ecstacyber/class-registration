namespace ClassRegistration.Server.Models
{
    public class RegistrationInfo
    {
        public required string Id { get; set; }
        public required string UserId { get; set; }
        public required string ClassId { get; set; }
        public required string SemesterId { get; set; }
        public string? TuitionFeeInfoId { get; set; }
    }
}

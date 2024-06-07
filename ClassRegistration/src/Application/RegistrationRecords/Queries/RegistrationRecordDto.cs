namespace ClassRegistration.Application.RegistrationRecords.Queries;

public class RegistrationRecordDto
{
    public IReadOnlyCollection<RegistrationRecordResult> Result { get; set; } = new List<RegistrationRecordResult>();
    public int Count { get; set; }
}

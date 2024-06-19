namespace ClassRegistration.Application.Users.Queries;
public class UserTableDataDto
{
    public IReadOnlyCollection<UserResult> Result { get; set; } = new List<UserResult>();
    public int Count { get; set; }
}

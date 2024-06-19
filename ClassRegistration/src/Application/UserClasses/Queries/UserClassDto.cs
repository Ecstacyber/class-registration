using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.UserClasses.Queries;

public class UserClassDto
{
    public IReadOnlyCollection<UserClassResult> Result { get; set; } = new List<UserClassResult>();
    public int Count { get; set; }
}

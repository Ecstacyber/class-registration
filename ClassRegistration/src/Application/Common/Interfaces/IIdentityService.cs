using ClassRegistration.Application.Common.Models;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<bool> AuthorizeAsync(string userId, string policyName);
    Task<List<string>> GetUserRoleAsync(int humanId);
    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);
    Task<Result> DeleteUserAsync(string userId);
    Task<User> GetUserInfoAsync(string id);
    Task<IEnumerable<User?>> GetUserListAsync();
}

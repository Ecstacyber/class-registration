using ClassRegistration.Application.Common.Models;
using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<bool> AddToRoleAsync(string userId, List<string> roles);
    Task<bool> AuthorizeAsync(string userId, string policyName);
    Task<List<string>> GetUserRoleAsync(int humanId);
    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password, int humanId);
    Task<Result> EditUserAsync(int humanId, string userName, string password, string email, List<string> roles);
    Task<Result> DeleteUserAsync(string userId);
    Task<User> GetUserInfoAsync(string id);
    Task<IEnumerable<User?>> GetUserListAsync();
    Task<bool> BlockUserAsync(int humanId);
    Task<bool> UnblockUserAsync(int humanId);
    Task<bool> RemoveAllRolesFromUserAsync(string userId);
}

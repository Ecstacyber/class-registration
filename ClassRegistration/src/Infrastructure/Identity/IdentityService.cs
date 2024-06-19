using ClassRegistration.Application.Common.Interfaces;
using ClassRegistration.Application.Common.Models;
using ClassRegistration.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ClassRegistration.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly IApplicationDbContext _context;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService,
        IApplicationDbContext context)
    {
        _userManager = userManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
        _context = context;
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user?.UserName;
    }

    public async Task<List<string>> GetUserRoleAsync(int humanId)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.HumanId == humanId);
        if (user == null) return new List<string>();

        return (await _userManager.GetRolesAsync(user)).ToList();
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password, int humanId)
    {
        var user = new ApplicationUser
        {
            UserName = userName,
            Email = userName,
            HumanId = humanId,
        };

        var createResult = await _userManager.CreateAsync(user, password);
        await _userManager.SetLockoutEnabledAsync(user, false);

        return (createResult.ToApplicationResult(), user.Id);
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return false;
        }

        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        var result = await _authorizationService.AuthorizeAsync(principal, policyName);

        return result.Succeeded;
    }

    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user != null ? await DeleteUserAsync(user) : Result.Success();
    }

    public async Task<Result> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);

        return result.ToApplicationResult();
    }

    public async Task<User> GetUserInfoAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return new User();

        user.Human = await _context.Humans.FirstOrDefaultAsync(x => x.Id == user.HumanId);
        if (user.Human == null) return new User();
        user.Human.Roles = await _userManager.GetRolesAsync(user);

        return user.Human;
    }

    public async Task<IEnumerable<User?>> GetUserListAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        foreach (var user in users)
        {
            user.Human = await _context.Humans
                .Include(x => x.Department)
                .FirstOrDefaultAsync(x => x.Id == user.HumanId);
            if (user.Human == null) continue;
            user.Human.Roles = await _userManager.GetRolesAsync(user);
        }

        return users.Select(x => x.Human);
    }

    public async Task<bool> BlockUserAsync(int humanId)
    {
        var user = await _userManager.Users.Include(x => x.Human).FirstOrDefaultAsync(x => x.HumanId == humanId);
        if (user == null) return false;
        await _userManager.SetLockoutEnabledAsync(user, true);
        await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));
        return true;
    }

    public async Task<bool> UnblockUserAsync(int humanId)
    {
        var user = await _userManager.Users.Include(x => x.Human).FirstOrDefaultAsync(x => x.HumanId == humanId);
        if (user == null) return false;
        await _userManager.SetLockoutEnabledAsync(user, false);
        await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddSeconds(-1));
        return true;
    }

    public async Task<bool> RemoveAllRolesFromUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;
        await _userManager.RemoveFromRolesAsync(user, _userManager.GetRolesAsync(user).Result.ToList());
        return true;
    }

    public async Task<bool> AddToRoleAsync(string userId, List<string> roles)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        foreach (var role in roles)
        {
            await _userManager.AddToRoleAsync(user, role);
        }
        return true;
    }

    public async Task<Result> EditUserAsync(int humanId, string userName, string password, string email, List<string> roles)
    {
        var user = _userManager.Users.Include(x => x.Human).FirstOrDefault(x => x.HumanId == humanId);
        if (user == null)
        {
            return Result.Failure(["User not found"]);
        }
        user.Email = email;
        user.UserName = userName;

        await _userManager.UpdateNormalizedEmailAsync(user);
        await _userManager.UpdateNormalizedUserNameAsync(user);

        var pwToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        await _userManager.ResetPasswordAsync(user, pwToken, password);

        await RemoveAllRolesFromUserAsync(user.Id);
        await AddToRoleAsync(user.Id, roles);

        return Result.Success();
    }
}

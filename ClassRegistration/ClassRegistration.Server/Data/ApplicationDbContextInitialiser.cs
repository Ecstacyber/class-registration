using ClassRegistration.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ClassRegistration.Server.Data
{
    public class ApplicationDbContextInitialiser(
        ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger = logger;
        private readonly ApplicationDbContext _context = context;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;

        public async Task InitialiseAsync()
        {
            try
            {
                if (_context.Database.IsSqlServer())
                {
                    await _context.Database.MigrateAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }
        public async Task SeedAsync()
        {
            try
            {
                await TrySeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }

        public async Task TrySeedAsync()
        {
            // Default roles
            var adminRole = new IdentityRole("Admin");
            if (_roleManager.Roles.All(r => r.Name != adminRole.Name))
            {
                var role = await _roleManager.CreateAsync(adminRole);
                if (role != null)
                {
                    await _roleManager.AddClaimAsync(adminRole, new Claim("RoleClaim", "HasRoleView"));
                    await _roleManager.AddClaimAsync(adminRole, new Claim("RoleClaim", "HasRoleAdd"));
                    await _roleManager.AddClaimAsync(adminRole, new Claim("RoleClaim", "HasRoleEdit"));
                    await _roleManager.AddClaimAsync(adminRole, new Claim("RoleClaim", "HasRoleDelete"));
                }
            }

            var studentRole = new IdentityRole("Student");
            if (_roleManager.Roles.All(r => r.Name != studentRole.Name))
            {
                var role = await _roleManager.CreateAsync(studentRole);
                if (role != null)
                {
                    await _roleManager.AddClaimAsync(studentRole, new Claim("RoleClaim", "HasRoleView"));
                    await _roleManager.AddClaimAsync(studentRole, new Claim("RoleClaim", "HasRoleAdd"));
                    await _roleManager.AddClaimAsync(studentRole, new Claim("RoleClaim", "HasRoleEdit"));
                    await _roleManager.AddClaimAsync(studentRole, new Claim("RoleClaim", "HasRoleDelete"));
                }
            }

            // Default users
            var admin = new ApplicationUser { UserName = "admin", Email = "admin@gmail.com" };
            if (_userManager.Users.All(u => u.UserName != admin.UserName))
            {
                await _userManager.CreateAsync(admin, "Admin@123");
                if (!string.IsNullOrWhiteSpace(adminRole.Name))
                {
                    await _userManager.AddToRolesAsync(admin, new[] { adminRole.Name });
                }
            }

            var student = new ApplicationUser { UserName = "student", Email = "student@gmail.com" };
            if (_userManager.Users.All(u => u.UserName != student.UserName))
            {
                await _userManager.CreateAsync(student, "Student@123");
                if (!string.IsNullOrWhiteSpace(studentRole.Name))
                {
                    await _userManager.AddToRolesAsync(student, new[] { studentRole.Name });
                }
            }
        }
    }
}

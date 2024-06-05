using System.Runtime.InteropServices;
using ClassRegistration.Domain.Constants;
using ClassRegistration.Domain.Entities;
using ClassRegistration.Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ClassRegistration.Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();

        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            await _context.Database.MigrateAsync();
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
        // Default departments
        var adminDepartment = new Department
        {
            ShortName = "ADMIN",
            FullName = "Administrator",
            Description = "Default administrator department for development, testing",
        };
        if (!_context.Departments.Any(x => x.ShortName == adminDepartment.ShortName))
        {
            await _context.Departments.AddAsync(adminDepartment);
            await _context.SaveChangesAsync();
        }

        var studentDepartment = new Department
        {
            ShortName = "STUDENT",
            FullName = "Student",
            Description = "Default student department for development, testing",
        };
        if (!_context.Departments.Any(x => x.ShortName == studentDepartment.ShortName))
        {
            await _context.Departments.AddAsync(studentDepartment);
            await _context.SaveChangesAsync();
        }

        // Default roles
        var administratorRole = new IdentityRole(Roles.Administrator);
        if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
        {
            await _roleManager.CreateAsync(administratorRole);
        }

        var lecturerRole = new IdentityRole(Roles.Lecturer);
        if (_roleManager.Roles.All(r => r.Name != lecturerRole.Name))
        {
            await _roleManager.CreateAsync(lecturerRole);
        }

        var studentRole = new IdentityRole(Roles.Student);
        if (_roleManager.Roles.All(r => r.Name != studentRole.Name))
        {
            await _roleManager.CreateAsync(studentRole);
        }

        // Default users
        var humanAdmin = new User { UserName = "administrator@localhost", Email = "administrator@localhost", Department = adminDepartment, DepartmentId = adminDepartment.Id };
        if (!_context.Humans.Any(x => x.UserName == humanAdmin.UserName))
        {
            await _context.Humans.AddAsync(humanAdmin);
        }
        var humanStudent = new User { UserName = "student@localhost", Email = "student@localhost", Department = studentDepartment, DepartmentId = studentDepartment.Id };
        if (!_context.Humans.Any(x => x.UserName == humanStudent.UserName))
        {
            await _context.Humans.AddAsync(humanStudent);
        }
        var humanLecturer = new User { UserName = "lecturer@localhost", Email = "lecturer@localhost", Department = adminDepartment, DepartmentId = adminDepartment.Id };
        if (!_context.Humans.Any(x => x.UserName == humanStudent.UserName))
        {
            await _context.Humans.AddAsync(humanStudent);
        }
        await _context.SaveChangesAsync();

        var administrator = new ApplicationUser { UserName = "administrator@localhost", Email = "administrator@localhost", HumanId = humanAdmin.Id };
        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, "Administrator@1");
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
            {
                await _userManager.AddToRolesAsync(administrator, new [] { administratorRole.Name });
            }
        }

        var lecturer = new ApplicationUser { UserName = "lecturer@localhost", Email = "lecturer@localhost", HumanId = humanLecturer.Id };
        if (_userManager.Users.All(u => u.UserName != lecturer.UserName))
        {
            await _userManager.CreateAsync(lecturer, "Lecturer@1");
            if (!string.IsNullOrWhiteSpace(lecturerRole.Name))
            {
                await _userManager.AddToRolesAsync(lecturer, new[] { lecturerRole.Name });
            }
        }

        var student = new ApplicationUser { UserName = "student@localhost", Email = "student@localhost", HumanId = humanStudent.Id };
        if (_userManager.Users.All(u => u.UserName != student.UserName))
        {
            await _userManager.CreateAsync(student, "Student@1");
            if (!string.IsNullOrWhiteSpace(studentRole.Name))
            {
                await _userManager.AddToRolesAsync(student, new[] { studentRole.Name });
            }
        }

        // Default class types
        if (!_context.ClassTypes.Any(x => x.Type == "Lý thuyết"))
        {
            var lt_type = new ClassType { Type = "Lý thuyết" };
            _context.ClassTypes.Add(lt_type);
            await _context.SaveChangesAsync();
        }
        if (!_context.ClassTypes.Any(x => x.Type == "Thực hành"))
        {
            var th_type = new ClassType { Type = "Thực hành" };
            _context.ClassTypes.Add(th_type);
            await _context.SaveChangesAsync();
        }

        // Default data
        // Seed, if necessary
        if (!_context.TodoLists.Any())
        {
            _context.TodoLists.Add(new TodoList
            {
                Title = "Todo List",
                Items =
                {
                    new TodoItem { Title = "Make a todo list 📃" },
                    new TodoItem { Title = "Check off the first item ✅" },
                    new TodoItem { Title = "Realise you've already done two things on the list! 🤯"},
                    new TodoItem { Title = "Reward yourself with a nice, long nap 🏆" },
                }
            });

            await _context.SaveChangesAsync();
        }
    }
}

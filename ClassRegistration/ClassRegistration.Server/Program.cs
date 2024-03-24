using ClassRegistration.Server.Data;
using ClassRegistration.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ClassRegistration.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAnyOrigin",
                corsBuilder => corsBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            });
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddDatabaseDeveloperPageExceptionFilter();
            builder.Services.AddAuthorization();
            builder.Services.AddIdentityApiEndpoints<ApplicationUser>().AddEntityFrameworkStores<ApplicationDbContext>();
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            
            var app = builder.Build();

            app.UseCors("AllowAnyOrigin");
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.MapIdentityApi<ApplicationUser>();

            app.MapPost("/logout", async (SignInManager<ApplicationUser> signInManager) =>
            {

                await signInManager.SignOutAsync();
                return Results.Ok();

            }).RequireAuthorization();


            app.MapGet("/pingauth", (ClaimsPrincipal user) =>
            {
                var email = user.FindFirstValue(ClaimTypes.Email); // get the user's email from the claim
                return Results.Json(new { Email = email }); ; // return the email as a plain text response
            }).RequireAuthorization();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseMigrationsEndPoint();
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}

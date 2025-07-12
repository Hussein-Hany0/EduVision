using GraduationProject.App.Hubs;
using GraduationProject.App.Models;
using GraduationProject.App.Repositories;
using Microsoft.EntityFrameworkCore;
using Predator.App.Repositories;

namespace GraduationProject.App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            builder.Services.AddSession();

            string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<PredatorContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });

            builder.Services.AddScoped<IUserRepository , UserRepository>();

            builder.Services.AddScoped<ILectureRepository, LectureRepository>();

            builder.Services.AddScoped<IMindStateRepository, MindStateRepository>();

            builder.Services.AddSignalR();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseSession();

            app.MapHub<PredictionHub>("/predictionHub");

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Login}/{id?}");

            app.Run();
        }
    }
}

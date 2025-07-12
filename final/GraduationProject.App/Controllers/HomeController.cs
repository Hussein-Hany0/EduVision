using GraduationProject.App.FilterAttributes;
using GraduationProject.App.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Predator.App.Repositories;
using System.Diagnostics;

namespace Predator.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserRepository _userRepository;

        [RequireLogin]
        public IActionResult Index()
        {
            string jsonUser = HttpContext.Session.GetString("SessionUser");

            User serializedUser = JsonConvert.DeserializeObject<User>(jsonUser);

            return View("index", serializedUser);
        }

        [RequireLogin]
        public IActionResult CreateLecture()
        {
            return RedirectToAction("CreateLecture", "User");
        }

        public IActionResult Login()
        {
            return RedirectToAction("Login", "User");
        }

        public IActionResult Regiser()
        {
            return RedirectToAction("Register" , "User");
        }

        [RequireLogin]
        public IActionResult Overview()
        {
            return RedirectToAction("Overview", "User");
        }

        [RequireLogin]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("SessionUser");

            return RedirectToAction("index", "Home");
        }
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

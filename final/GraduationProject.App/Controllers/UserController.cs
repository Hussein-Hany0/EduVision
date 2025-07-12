using Azure;
using GraduationProject.App.FilterAttributes;
using GraduationProject.App.Models;
using GraduationProject.App.Repositories;
using GraduationProject.App.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Predator.App.Repositories;
using System.Text;

namespace Predator.App.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;

        private readonly ILectureRepository _lectureRepository;
        public  UserController(IUserRepository userRepository , ILectureRepository lectureRepository)
        {
            _userRepository = userRepository;

            _lectureRepository = lectureRepository;
        }

        #region Index Region

        [HttpGet]
        public IActionResult Login()
        {
            return View("Login"); 
        }

        [HttpGet]
        public IActionResult Register()
        {
            UserViewModel userViewModel = new UserViewModel();

            return View("Register" , userViewModel);
        }

        [HttpGet]
        [RequireLogin]
        public IActionResult Overview()
        {
            User user = GetUser();

            List<Lecture> lectures = _lectureRepository.GetLectures(user.UserId);

            ViewBag.Lectures = lectures;

            return View("Overview", user);
        }

        [HttpGet]
        [RequireLogin]
        public IActionResult ChangePassword()
        {
            User user = GetUser();

            return View("ChangePassword" , user);
        }

        [HttpGet]
        [RequireLogin]
        public IActionResult CreateLecture()
        {
            User user = GetUser();

            ViewBag.User = user;

            return View("CreateLecture");
        }
        #endregion


        #region Login Region

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            if (_userRepository.IsAuthenticatedUser(email, password))
            {
                User serializedUser = _userRepository.GetUserByCredentials(email, password);

                HttpContext.Session.SetString("SessionUser", JsonConvert.SerializeObject(serializedUser));

                return RedirectToAction("Index", "Home");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Email or password is incorrect.");

                return View();
            }
        }
        #endregion


        #region Register Region

        [HttpPost]
        public IActionResult Register(UserViewModel userViewModel , string repeatedPassword)
        {

            if (ModelState.IsValid)
            {
                if (userViewModel.IsTermsAccepted)
                {
                    User user = new User
                    {
                        UserName = userViewModel.UserName,
                        Email = userViewModel.Email,
                        Password = userViewModel.Password,
                        Gender = int.Parse(userViewModel.SelectedGender)
                    };

                    _userRepository.CreateUser(user);

                    HttpContext.Session.SetString("SessionUser", JsonConvert.SerializeObject(user));

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }

        }
        #endregion


        #region ChangePassword Region
        [RequireLogin]
        public IActionResult ChangePassword(int id, string oldPassword, string newPassword, string repeatedPassword)
        {

            if (_userRepository.CompareOldPasswordToCurrentPassword(id, oldPassword))
            {
                if (newPassword == repeatedPassword)
                    _userRepository.UpdatePassword(id, newPassword);
            }

            return RedirectToAction("index", "Home");
        }
        #endregion


        #region CreateLecture Region

        [HttpPost]
        [RequireLogin]
        public IActionResult CreateLecture(LectureViewModel lectureViewModel)
        {
            if (ModelState.IsValid)
            {
                Lecture lecture = new Lecture()
                {
                    Title = lectureViewModel.Title,
                    Course = lectureViewModel.Course,
                    Link = lectureViewModel.Link,
                    UserId = lectureViewModel.UserId
                };

                _lectureRepository.CreateLecture(lecture);

                return RedirectToAction("Dashboard", "Meeting" , new { meetingId = lecture.Link });
            }
            else
            {
                return BadRequest();
            }

        }

        private User GetUser()
        {
            string jsonUser = HttpContext.Session.GetString("SessionUser");

            User serializedUser = JsonConvert.DeserializeObject<User>(jsonUser);

            return serializedUser;
        }
        #endregion

        [RequireLogin]
        public IActionResult Profile()
        {
            User? user = GetUser();

            List<Lecture> lectures = _userRepository.GetUserLectures(user.UserId);

            ProfileViewModel model = new ProfileViewModel()
            {
                UserName = user.UserName,
                Email = user.Email,
                Gender = user.Gender,
                Lectures = lectures
            };

            return View("Profile", model);
        }

        [RequireLogin]
        public IActionResult Privacy()
        {
            User? user = GetUser();

            return View(user);
        }
    }
}

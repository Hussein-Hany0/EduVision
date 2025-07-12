using GraduationProject.App.FilterAttributes;
using GraduationProject.App.Models;
using GraduationProject.App.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.Json;
using Newtonsoft.Json;
using Predator.App.Repositories;
using System.Text;

namespace Predator.Controllers
{
    [RequireLogin]
    public class MeetingController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly ILectureRepository _lectureRepository;
        private readonly IMindStateRepository _mindStateRepository;

        public MeetingController(IUserRepository userRepository , IMindStateRepository mindStateRepository , ILectureRepository lectureRepository)
        {
            _userRepository = userRepository;
            _mindStateRepository = mindStateRepository;
            _lectureRepository = lectureRepository;
        }

        public IActionResult Preview()
        {
            string jsonUser = HttpContext.Session.GetString("SessionUser");

            User serializedUser = JsonConvert.DeserializeObject<User>(jsonUser);

            return View(serializedUser);
        }

        public IActionResult EmptyPageWhenNoMeeting()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Meeting(string meetingId = "", string hostName = "",bool isNewMeeting = true)
        {   
            string jsonUser = HttpContext.Session.GetString("SessionUser");

            User serializedUser = JsonConvert.DeserializeObject<User>(jsonUser);

            if(meetingId != "" && hostName != "")
            {
                ViewData["meetingId"] = meetingId;
                ViewData["hostName"] = hostName;
                ViewData["isNewMeeting"] = isNewMeeting = false; ;
            }
            else
            {
                ViewData["isNewMeeting"] = isNewMeeting = true;
            }

            return View(serializedUser);
        }

        public IActionResult Dashboard(string meetingId)
        {
            string jsonUser = HttpContext.Session.GetString("SessionUser");

            User serializedUser = JsonConvert.DeserializeObject<User>(jsonUser);

            Lecture lecture = _lectureRepository.GetLectureByLectureLink(meetingId);

            ViewBag.Lecture = lecture;

            return View(serializedUser);
        }

        [HttpPost]
        public void SetPrediction([FromBody]MindState prediction)
        {
            _mindStateRepository.SavePrediction(prediction);
        }
    }
}

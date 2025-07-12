using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GraduationProject.App.Models;
using GraduationProject.App.ViewModels;

namespace GraduationProject.App.Controllers
{
    public class SummaryController : Controller
    {
        private readonly PredatorContext _context;

        public SummaryController(PredatorContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string meetingId)
        {
            if (string.IsNullOrWhiteSpace(meetingId))
            {
                return BadRequest("Meeting ID is required or set improperly.");
            }

            var mindStates = await _context.MindStates
                .Where(ms => ms.MeetinxgId == meetingId)
                .Include(ms => ms.User)
                .ToListAsync();

            Lecture lecture = _context.Lectures.Where(lecture => lecture.Link == meetingId).FirstOrDefault();

            var summaries = mindStates
                .GroupBy(ms => ms.UserId)
                .Select(group => new SummaryViewModel
                {
                    MeetingId = meetingId,
                    UserId = group.Key,
                    UserName = group.First().User.UserName,
                    StateCounts = group
                        .GroupBy(ms => ms.State)
                        .ToDictionary(g => g.Key, g => g.Count()),

                    Likes = group.Count(ms => ms.Hnad_Mode == "like"),
                    Dislikes = group.Count(ms => ms.Hnad_Mode == "dislike"),
                    HandsRaised = group.Count(ms => ms.Hnad_Mode == "raised_hand"),

                    GazeTotal = group.Count(ms => ms.Gaze_Mode != null),
                    GazeCenter = group.Count(ms => ms.Gaze_Mode == "looking center"),

                    Lecture = lecture
                })
                .ToList();

            return View(summaries);
        }

    }
}

using GraduationProject.App.Models;
using Microsoft.AspNetCore.SignalR;
using GraduationProject.App.ViewModels;
using Newtonsoft.Json;

namespace GraduationProject.App.Hubs
{
    public class PredictionHub : Hub
    {
        private PredatorContext _context;
        public PredictionHub(PredatorContext context)
        {
            _context = context;
        }

        public void PushMindState(string stringMindStateViewModel)
        {
            MindStateViewModel mindStateViewModel = JsonConvert.DeserializeObject<MindStateViewModel>(stringMindStateViewModel);

            MindState mindState = new MindState
            {
                UserId = mindStateViewModel.UserId,

                MeetinxgId = mindStateViewModel.MeetingId,

                State = mindStateViewModel.State,

                Hnad_Mode = mindStateViewModel.Hand,

                Gaze_Mode = mindStateViewModel.Gaze
            };

            _context.MindStates.Add(mindState);

            _context.SaveChanges();

            Clients.All.SendAsync("PullMindState", mindStateViewModel);
        }

        public void PushHandMode(HandModeViewModel handMode)
        {
            Clients.All.SendAsync("PullHandMode", handMode);
        }

    }
}

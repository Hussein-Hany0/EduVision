using GraduationProject.App.Models;

namespace GraduationProject.App.Repositories
{
    public interface IMindStateRepository
    {
        public void SavePrediction(MindState prediction);
    }
    public class MindStateRepository : IMindStateRepository
    {
        private readonly PredatorContext _context;

        public MindStateRepository(PredatorContext context)
        {
            _context = context;
        }

        public void SavePrediction(MindState prediction)
        {
            _context.MindStates.Add(prediction);

            _context.SaveChanges();
        }
    }
}

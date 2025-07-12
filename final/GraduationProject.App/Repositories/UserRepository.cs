using GraduationProject.App.Models;

namespace Predator.App.Repositories
{
    public interface IUserRepository
    {
        public bool IsAuthenticatedUser(string email, string password);

        public User GetUserByCredentials(string email, string password);

        public void CreateUser(User user);

        public bool CompareOldPasswordToCurrentPassword(int id, string oldPassword);

        public void UpdatePassword(int id, string newPassword);

        public List<Lecture> GetUserLectures(int userId);

        public void ChangeUserRoleToInstructor(int userId);

        public void ReturnUserRoleToStudent(int userId);
    }
    public class UserRepository : IUserRepository
    {
        private PredatorContext _context;
        public UserRepository(PredatorContext context)
        {
            _context = context;
        }

        public bool CompareOldPasswordToCurrentPassword(int id, string oldPassword)
        {
            User? user = _context.Users.Find(id);

            return user.Password == oldPassword ? true : false;
        }

        public void CreateUser(User user)
        {
            //the _context will infer the table by knowing the type of the arguemnt passed.
            _context.Add(user);

            _context.SaveChanges();
        }

        public User GetUserByCredentials(string email, string password)
        {
            User? user = _context.Users.SingleOrDefault(user
                => user.Email == email && user.Password == password);

            return user;
        }

        public bool IsAuthenticatedUser(string email , string password)
        {
            User? user = _context.Users.SingleOrDefault(user
                => user.Email == email && user.Password == password);

            return user == null ? false : true;
        }

        public void UpdatePassword(int id, string newPassword)
        {
            User? user = _context.Users.Find(id);

            user.Password = newPassword;

            _context.SaveChanges();
        }

        public List<Lecture> GetUserLectures(int userId)
        {
            List<Lecture> lectures = _context.Lectures.Where(lecture => lecture.UserId == userId).ToList();

            return lectures;
        }

        public void ChangeUserRoleToInstructor(int userId)
        {
            User user = _context.Users.Where(user => user.UserId == userId).FirstOrDefault();

            user.Role = 1;

            _context.SaveChanges();
        }

        public void ReturnUserRoleToStudent(int userId)
        {
            User user = _context.Users.Where(user => user.UserId == userId).FirstOrDefault();

            user.Role = 0;

            _context.SaveChanges();
        }
    }
}

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GraduationProject.App.ViewModels
{
    public class LectureViewModel
    {
        [DisplayName("Lecture Title"), StringLength(50 , MinimumLength = 3)]
        public string Title { get; set; } = null!;

        [DisplayName("Coures Title") , StringLength(50, MinimumLength = 3)]
        public string Course { get; set; } = null!;

        [DisplayName("Lecture Link")]
        public string Link { get; set; } = null!;

        [DisplayName("Instructor ID")]
        public int UserId { get; set; }
    }
}

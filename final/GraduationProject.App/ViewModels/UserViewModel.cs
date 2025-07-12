using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace GraduationProject.App.ViewModels
{
    public class UserViewModel
    {
        [Display(Name = "Your Name")]
        public string UserName { get; set; }

        [EmailAddress(ErrorMessage = "This is not a valid email address"), MaxLength(50)]
        public string Email { get; set; }

        public string Password { get; set; }

        [Display(Name = "Repeated Password")]
        public string RepeatedPassword { get; set; }

        public string SelectedGender { get; set; }

        public IEnumerable<SelectListItem> items { get; set; } = new List<SelectListItem>
        {
            new SelectListItem {Value = "0" , Text = "Male" },
            new SelectListItem {Value = "1" , Text = "Female" }
        };

        public bool IsTermsAccepted { get; set; }
    }
}

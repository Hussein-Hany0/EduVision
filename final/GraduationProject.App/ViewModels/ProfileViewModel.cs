using GraduationProject.App.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace GraduationProject.App.ViewModels
{
    public class ProfileViewModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }

        public int Gender { get; set; }

        public List<Lecture> Lectures { get; set; }
    }
}

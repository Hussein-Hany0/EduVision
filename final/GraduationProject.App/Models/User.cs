using System;
using System.Collections.Generic;

namespace GraduationProject.App.Models
{
    public partial class User
    {
        public int UserId { get; set; }

        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public int Role { get; set; }

        public int Gender { get; set; }

        public virtual ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();

        public virtual ICollection<MindState> MindStates { get; set; } = new List<MindState>();
    }
}


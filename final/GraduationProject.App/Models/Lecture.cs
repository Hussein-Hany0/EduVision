using System;
using System.Collections.Generic;

namespace GraduationProject.App.Models
{
    public partial class Lecture
    {
        public int LectureId { get; set; }

        public string Title { get; set; } = null!;

        public string Course { get; set; } = null!;

        public string Link { get; set; } = null!;

        public int UserId { get; set; }

        public virtual User User { get; set; } = null!;
    }
}


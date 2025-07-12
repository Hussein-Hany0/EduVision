using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace GraduationProject.App.Models
{
    public partial class MindState
    {
        public int MindStateId { get; set; }

        public int UserId { get; set; }

        public int LectureId { get; set; }

        public string MeetinxgId { get; set; } = null!;

        public string State { get; set; } = null!;

        [AllowNull]
        [MaxLength(30)]
        public string? Hnad_Mode { get; set; }

        [AllowNull]
        [MaxLength(30)]
        public string? Gaze_Mode { get; set; }
        public virtual User User { get; set; } = null!;
    }

}


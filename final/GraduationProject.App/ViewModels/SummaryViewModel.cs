using GraduationProject.App.Models;

public class SummaryViewModel
{
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public string MeetingId { get; set; } = null!;
    public Dictionary<string, int> StateCounts { get; set; } = new();
    public int TotalStates => StateCounts.Values.Sum();
    public string DominantState => StateCounts.OrderByDescending(kvp => kvp.Value).FirstOrDefault().Key ?? "Unknown";

    public double EngagementScore =>
        StateCounts.TryGetValue("Focused", out var focused)
            ? Math.Round((double)focused / TotalStates * 100, 2)
            : 0;

    // New props:
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public int HandsRaised { get; set; }

    public int GazeTotal { get; set; }
    public int GazeCenter { get; set; }
    public double FocusPercentage =>
        GazeTotal == 0 ? 0 : Math.Round((double)GazeCenter / GazeTotal * 100, 2);

    public Lecture Lecture { get; set; }
}

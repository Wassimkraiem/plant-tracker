namespace PlantTracker.API.Models;

public class Suggestion
{
    public string Type { get; set; } = string.Empty; // "warning", "info", "success", "tip"
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Priority { get; set; } // Higher = more urgent
}

public class PlantSuggestions
{
    public int PlantId { get; set; }
    public string PlantName { get; set; } = string.Empty;
    public List<Suggestion> Suggestions { get; set; } = new();
}


namespace PlantTracker.API.Models;

public class Plant
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // e.g., "Olive Tree", "Tomato", "Cucumber"
    public string Description { get; set; } = string.Empty;
    public DateTime PlantedDate { get; set; }
    public int WateringFrequencyDays { get; set; } // How often to water (in days)
    public DateTime? LastWateredDate { get; set; }
    public string CareInstructions { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    
    // Detailed care instructions
    public string SunlightRequirements { get; set; } = string.Empty;
    public string SoilType { get; set; } = string.Empty;
    public string FertilizingSchedule { get; set; } = string.Empty;
    public string PruningTips { get; set; } = string.Empty;
    public string CommonPests { get; set; } = string.Empty;
    public string HarvestingInfo { get; set; } = string.Empty;
    public string GrowthStages { get; set; } = string.Empty;
    
    public List<WateringLog> WateringLogs { get; set; } = new();
    public List<CareTask> CareTasks { get; set; } = new();
}

public class WateringLog
{
    public int Id { get; set; }
    public int PlantId { get; set; }
    public DateTime WateredDate { get; set; }
    public string? Notes { get; set; }
}

public class CareTask
{
    public int Id { get; set; }
    public int PlantId { get; set; }
    public string TaskName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
}


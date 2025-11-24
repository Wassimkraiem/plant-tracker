using Microsoft.EntityFrameworkCore;
using PlantTracker.API.Data;
using PlantTracker.API.Models;

namespace PlantTracker.API.Services;

public class SuggestionService : ISuggestionService
{
    private readonly PlantTrackerContext _context;

    public SuggestionService(PlantTrackerContext context)
    {
        _context = context;
    }

    public async Task<PlantSuggestions> GenerateSuggestionsForPlant(Plant plant)
    {
        var suggestions = new PlantSuggestions
        {
            PlantId = plant.Id,
            PlantName = plant.Name,
            Suggestions = new List<Suggestion>()
        };

        // Load related data if not already loaded
        if (plant.CareTasks == null || plant.WateringLogs == null)
        {
            plant = await _context.Plants
                .Include(p => p.CareTasks)
                .Include(p => p.WateringLogs)
                .FirstOrDefaultAsync(p => p.Id == plant.Id) ?? plant;
        }

        // Check watering schedule
        CheckWateringSchedule(plant, suggestions.Suggestions);

        // Check overdue tasks
        CheckOverdueTasks(plant, suggestions.Suggestions);

        // Check plant age and growth stage
        CheckPlantAge(plant, suggestions.Suggestions);

        // Seasonal recommendations
        AddSeasonalRecommendations(plant, suggestions.Suggestions);

        // Plant type specific tips
        AddPlantSpecificTips(plant, suggestions.Suggestions);

        // Check for no recent activity
        CheckActivityLevel(plant, suggestions.Suggestions);

        // Sort by priority (descending)
        suggestions.Suggestions = suggestions.Suggestions.OrderByDescending(s => s.Priority).ToList();

        return suggestions;
    }

    public async Task<List<PlantSuggestions>> GenerateSuggestionsForAllPlants(int userId)
    {
        var plants = await _context.Plants
            .Where(p => p.UserId == userId)
            .Include(p => p.CareTasks)
            .Include(p => p.WateringLogs)
            .ToListAsync();

        var allSuggestions = new List<PlantSuggestions>();

        foreach (var plant in plants)
        {
            var plantSuggestions = await GenerateSuggestionsForPlant(plant);
            if (plantSuggestions.Suggestions.Any())
            {
                allSuggestions.Add(plantSuggestions);
            }
        }

        return allSuggestions;
    }

    private void CheckWateringSchedule(Plant plant, List<Suggestion> suggestions)
    {
        if (plant.LastWateredDate == null)
        {
            suggestions.Add(new Suggestion
            {
                Type = "warning",
                Title = "No Watering History",
                Message = $"{plant.Name} has never been watered. Make sure to water it soon!",
                Icon = "💧",
                Priority = 10
            });
            return;
        }

        var daysSinceWatering = (DateTime.UtcNow - plant.LastWateredDate.Value).Days;
        var nextWateringDue = plant.WateringFrequencyDays - daysSinceWatering;

        if (daysSinceWatering > plant.WateringFrequencyDays + 2)
        {
            suggestions.Add(new Suggestion
            {
                Type = "warning",
                Title = "Urgent: Overdue Watering",
                Message = $"{plant.Name} is {daysSinceWatering - plant.WateringFrequencyDays} days overdue for watering! Water immediately to prevent stress.",
                Icon = "🚨",
                Priority = 10
            });
        }
        else if (daysSinceWatering >= plant.WateringFrequencyDays)
        {
            suggestions.Add(new Suggestion
            {
                Type = "warning",
                Title = "Watering Due",
                Message = $"{plant.Name} needs watering today. It's been {daysSinceWatering} days since last watering.",
                Icon = "💧",
                Priority = 8
            });
        }
        else if (nextWateringDue <= 1)
        {
            suggestions.Add(new Suggestion
            {
                Type = "info",
                Title = "Watering Soon",
                Message = $"{plant.Name} will need watering in {nextWateringDue} day(s). Prepare to water soon!",
                Icon = "📅",
                Priority = 5
            });
        }

        // Check for overwatering
        if (plant.WateringLogs != null && plant.WateringLogs.Count >= 3)
        {
            var recentWaterings = plant.WateringLogs
                .OrderByDescending(w => w.WateredDate)
                .Take(3)
                .ToList();

            var intervals = new List<int>();
            for (int i = 0; i < recentWaterings.Count - 1; i++)
            {
                var interval = (recentWaterings[i].WateredDate - recentWaterings[i + 1].WateredDate).Days;
                intervals.Add(interval);
            }

            if (intervals.Any() && intervals.Average() < plant.WateringFrequencyDays * 0.7)
            {
                suggestions.Add(new Suggestion
                {
                    Type = "info",
                    Title = "Possible Overwatering",
                    Message = $"You're watering {plant.Name} more frequently than recommended. Monitor for yellowing leaves or soggy soil.",
                    Icon = "⚠️",
                    Priority = 6
                });
            }
        }
    }

    private void CheckOverdueTasks(Plant plant, List<Suggestion> suggestions)
    {
        if (plant.CareTasks == null) return;

        var overdueTasks = plant.CareTasks
            .Where(t => !t.IsCompleted && t.DueDate.HasValue && t.DueDate.Value < DateTime.UtcNow)
            .OrderBy(t => t.DueDate)
            .ToList();

        if (overdueTasks.Any())
        {
            var taskCount = overdueTasks.Count;
            var mostOverdue = overdueTasks.First();
            var daysOverdue = (DateTime.UtcNow - mostOverdue.DueDate.Value).Days;

            suggestions.Add(new Suggestion
            {
                Type = "warning",
                Title = $"{taskCount} Overdue Task{(taskCount > 1 ? "s" : "")}",
                Message = $"{plant.Name} has {taskCount} overdue task{(taskCount > 1 ? "s" : "")}. '{mostOverdue.TaskName}' is {daysOverdue} days overdue.",
                Icon = "📋",
                Priority = 7
            });
        }

        // Check for upcoming tasks
        var upcomingTasks = plant.CareTasks
            .Where(t => !t.IsCompleted && t.DueDate.HasValue && 
                   t.DueDate.Value >= DateTime.UtcNow && 
                   t.DueDate.Value <= DateTime.UtcNow.AddDays(3))
            .ToList();

        if (upcomingTasks.Any())
        {
            var task = upcomingTasks.First();
            var daysUntil = (task.DueDate.Value - DateTime.UtcNow).Days;
            
            suggestions.Add(new Suggestion
            {
                Type = "info",
                Title = "Upcoming Task",
                Message = $"{plant.Name}: '{task.TaskName}' is due in {daysUntil} day{(daysUntil != 1 ? "s" : "")}.",
                Icon = "📅",
                Priority = 4
            });
        }
    }

    private void CheckPlantAge(Plant plant, List<Suggestion> suggestions)
    {
        var age = (DateTime.UtcNow - plant.PlantedDate).Days;

        // Young plant care
        if (age <= 30)
        {
            suggestions.Add(new Suggestion
            {
                Type = "tip",
                Title = "Young Plant Care",
                Message = $"{plant.Name} is only {age} days old. Keep soil consistently moist and protect from extreme conditions during establishment.",
                Icon = "🌱",
                Priority = 3
            });
        }

        // Growth milestones
        if (plant.Type == "Tomato" && age >= 60 && age <= 70)
        {
            suggestions.Add(new Suggestion
            {
                Type = "success",
                Title = "Harvest Time Approaching",
                Message = $"{plant.Name} is about {age} days old - tomatoes are typically ready to harvest around 60-80 days!",
                Icon = "🍅",
                Priority = 5
            });
        }

        if (plant.Type == "Cucumber" && age >= 50 && age <= 60)
        {
            suggestions.Add(new Suggestion
            {
                Type = "success",
                Title = "Harvest Ready Soon",
                Message = $"{plant.Name} should start producing cucumbers soon! Check daily for 6-8 inch cucumbers.",
                Icon = "🥒",
                Priority = 5
            });
        }
    }

    private void AddSeasonalRecommendations(Plant plant, List<Suggestion> suggestions)
    {
        var month = DateTime.UtcNow.Month;
        var season = month switch
        {
            12 or 1 or 2 => "winter",
            3 or 4 or 5 => "spring",
            6 or 7 or 8 => "summer",
            _ => "fall"
        };

        switch (season)
        {
            case "winter":
                if (plant.Type == "Olive Tree")
                {
                    suggestions.Add(new Suggestion
                    {
                        Type = "tip",
                        Title = "Winter Pruning Time",
                        Message = $"Winter is the ideal time to prune {plant.Name}. Remove dead or crossing branches while the tree is dormant.",
                        Icon = "✂️",
                        Priority = 4
                    });
                }
                break;

            case "spring":
                suggestions.Add(new Suggestion
                {
                    Type = "tip",
                    Title = "Spring Feeding",
                    Message = $"Spring is here! Consider fertilizing {plant.Name} to support new growth. Check soil moisture more frequently as growth accelerates.",
                    Icon = "🌸",
                    Priority = 4
                });
                break;

            case "summer":
                suggestions.Add(new Suggestion
                {
                    Type = "tip",
                    Title = "Summer Heat Care",
                    Message = $"During summer heat, {plant.Name} may need more frequent watering. Check soil daily and water in early morning or evening.",
                    Icon = "☀️",
                    Priority = 5
                });
                break;

            case "fall":
                if (plant.Type == "Olive Tree")
                {
                    suggestions.Add(new Suggestion
                    {
                        Type = "tip",
                        Title = "Harvest Season",
                        Message = $"Fall is olive harvest time! Check {plant.Name} for ripe olives. Green olives ripen first, followed by black olives.",
                        Icon = "🫒",
                        Priority = 6
                    });
                }
                break;
        }
    }

    private void AddPlantSpecificTips(Plant plant, List<Suggestion> suggestions)
    {
        var tips = plant.Type switch
        {
            "Tomato" => new[]
            {
                ("Pinch Suckers", "Remove suckers (shoots between stem and branches) weekly for larger fruits and better air circulation.", "✂️"),
                ("Support Check", "Ensure tomato cages or stakes are secure. Heavy fruit can cause plants to topple.", "🎋"),
                ("Leaf Health", "Check undersides of leaves for pests like hornworms or aphids. Early detection prevents major infestations.", "🔍")
            },
            "Cucumber" => new[]
            {
                ("Daily Harvest", "Check for cucumbers daily once fruiting begins. Harvest promptly to encourage more production.", "🥒"),
                ("Trellis Training", "Train vines up trellis for better air circulation and easier harvesting.", "🌿"),
                ("Powdery Mildew", "Watch for white powder on leaves. Ensure good air flow and avoid watering leaves.", "🍃")
            },
            "Pepper" => new[]
            {
                ("First Flowers", "Consider pinching off the first few flowers to encourage stronger plant growth before fruiting.", "🌸"),
                ("Calcium Boost", "Add crushed eggshells or calcium supplement to prevent blossom end rot.", "🥚"),
                ("Color Development", "Peppers change color as they ripen. Green to red takes 2-3 additional weeks but sweeter flavor.", "🫑")
            },
            "Olive Tree" => new[]
            {
                ("Drainage Check", "Ensure excellent drainage. Olives hate wet feet - root rot is a common issue.", "💧"),
                ("Pruning Shape", "Maintain open center structure for sunlight penetration and air circulation.", "✂️"),
                ("Patience", "Olive trees take 5-8 years to produce fruit. Focus on strong growth in early years.", "⏳")
            },
            _ => Array.Empty<(string, string, string)>()
        };

        var random = new Random(plant.Id + DateTime.UtcNow.DayOfYear);
        if (tips.Length > 0)
        {
            var tip = tips[random.Next(tips.Length)];
            suggestions.Add(new Suggestion
            {
                Type = "tip",
                Title = tip.Item1,
                Message = $"{plant.Name}: {tip.Item2}",
                Icon = tip.Item3,
                Priority = 2
            });
        }
    }

    private void CheckActivityLevel(Plant plant, List<Suggestion> suggestions)
    {
        var daysSincePlanted = (DateTime.UtcNow - plant.PlantedDate).Days;
        
        // Check if no care tasks exist for older plants
        if (daysSincePlanted > 14 && (plant.CareTasks == null || !plant.CareTasks.Any()))
        {
            suggestions.Add(new Suggestion
            {
                Type = "info",
                Title = "Add Care Tasks",
                Message = $"Consider adding care tasks for {plant.Name} like fertilizing, pruning, or pest checks to stay on top of maintenance.",
                Icon = "📝",
                Priority = 3
            });
        }

        // Check if no activity in watering logs
        if (plant.WateringLogs != null && plant.WateringLogs.Any())
        {
            var lastActivity = plant.WateringLogs.Max(w => w.WateredDate);
            var daysSinceActivity = (DateTime.UtcNow - lastActivity).Days;

            if (daysSinceActivity > 30)
            {
                suggestions.Add(new Suggestion
                {
                    Type = "info",
                    Title = "Low Activity",
                    Message = $"It's been {daysSinceActivity} days since any recorded activity for {plant.Name}. Don't forget to track your care!",
                    Icon = "📊",
                    Priority = 2
                });
            }
        }
    }
}


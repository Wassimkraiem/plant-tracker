using Microsoft.EntityFrameworkCore;
using PlantTracker.API.Models;

namespace PlantTracker.API.Data;

public class PlantTrackerContext : DbContext
{
    public PlantTrackerContext(DbContextOptions<PlantTrackerContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Plant> Plants { get; set; }
    public DbSet<WateringLog> WateringLogs { get; set; }
    public DbSet<CareTask> CareTasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships using Fluent API
        
        // User → Plants (One-to-Many)
        modelBuilder.Entity<Plant>()
            .HasOne(p => p.User)                    // Plant has ONE User
            .WithMany(u => u.Plants)                // User has MANY Plants
            .HasForeignKey(p => p.UserId)           // Foreign Key is UserId
            .OnDelete(DeleteBehavior.Cascade);      // Delete Plants when User is deleted

        // Plant → WateringLogs (One-to-Many)
        modelBuilder.Entity<WateringLog>()
            .HasOne(wl => wl.Plant)                 // WateringLog has ONE Plant
            .WithMany(p => p.WateringLogs)          // Plant has MANY WateringLogs
            .HasForeignKey(wl => wl.PlantId)        // Foreign Key is PlantId
            .OnDelete(DeleteBehavior.Cascade);      // Delete logs when Plant is deleted

        // Plant → CareTasks (One-to-Many)
        modelBuilder.Entity<CareTask>()
            .HasOne(ct => ct.Plant)                 // CareTask has ONE Plant
            .WithMany(p => p.CareTasks)             // Plant has MANY CareTasks
            .HasForeignKey(ct => ct.PlantId)        // Foreign Key is PlantId
            .OnDelete(DeleteBehavior.Cascade);      // Delete tasks when Plant is deleted

        // Seed demo user
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "demo",
                Email = "demo@planttracker.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("demo123"),
                FullName = "Demo User",
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed data with detailed instructions
        modelBuilder.Entity<Plant>().HasData(
            new Plant
            {
                Id = 1,
                UserId = 1,
                Name = "Mediterranean Olive Tree",
                Type = "Olive Tree",
                Description = "A beautiful olive tree from the Mediterranean region",
                PlantedDate = DateTime.Now.AddMonths(-6),
                WateringFrequencyDays = 7,
                LastWateredDate = DateTime.Now.AddDays(-3),
                CareInstructions = "Needs full sun exposure. Water deeply but infrequently. Prune in late winter or early spring. Fertilize in spring with balanced fertilizer.",
                ImageUrl = "🫒",
                SunlightRequirements = "Full sun (6-8 hours daily). Tolerates partial shade but produces fewer olives.",
                SoilType = "Well-draining soil with pH 5.5-8.5. Sandy loam or clay loam works best. Add compost for nutrients.",
                FertilizingSchedule = "Fertilize in spring with balanced 10-10-10 fertilizer. For mature trees, apply nitrogen-rich fertilizer in early spring.",
                PruningTips = "Prune in late winter (February-March). Remove dead, diseased, or crossing branches. Maintain an open center for air circulation. Light annual pruning is better than heavy cuts.",
                CommonPests = "Olive fruit fly, scale insects, olive psyllid. Monitor regularly. Use organic neem oil or insecticidal soap for treatment.",
                HarvestingInfo = "Olives ripen in fall (September-November). Green olives are harvested early, black olives when fully ripe. Hand-pick or use nets.",
                GrowthStages = "Year 1-2: Establishment. Year 3-5: Vegetative growth. Year 5+: Fruit production begins. Full production at 15-20 years."
            },
            new Plant
            {
                Id = 2,
                UserId = 1,
                Name = "Cherry Tomatoes",
                Type = "Tomato",
                Description = "Sweet cherry tomatoes perfect for salads",
                PlantedDate = DateTime.Now.AddMonths(-2),
                WateringFrequencyDays = 2,
                LastWateredDate = DateTime.Now.AddDays(-1),
                CareInstructions = "Requires 6-8 hours of sunlight. Water regularly, keeping soil moist but not waterlogged. Support with stakes or cages. Pinch off suckers for better fruit production.",
                ImageUrl = "🍅",
                SunlightRequirements = "Full sun (6-8 hours daily minimum). More sun = sweeter tomatoes. Avoid deep shade.",
                SoilType = "Rich, well-draining soil with pH 6.0-6.8. Add compost or aged manure. Good drainage prevents root rot.",
                FertilizingSchedule = "Feed every 2 weeks with balanced fertilizer. Switch to high-potassium fertilizer when flowering starts. Avoid over-fertilizing nitrogen.",
                PruningTips = "Pinch off suckers (shoots between main stem and branches) for larger fruits. Remove lower leaves touching ground. Top plants 4 weeks before first frost.",
                CommonPests = "Aphids, hornworms, whiteflies, spider mites. Inspect undersides of leaves. Use companion planting (basil, marigolds) or organic sprays.",
                HarvestingInfo = "Harvest when fully colored and slightly soft (60-80 days after transplanting). Pick regularly to encourage more fruit. Store at room temperature for best flavor.",
                GrowthStages = "Weeks 1-3: Seedling stage. Weeks 4-6: Vegetative growth. Weeks 7-8: Flowering. Weeks 9-12: Fruiting and ripening. Continuous harvest possible."
            },
            new Plant
            {
                Id = 3,
                UserId = 1,
                Name = "Garden Cucumber",
                Type = "Cucumber",
                Description = "Fresh cucumbers for summer salads",
                PlantedDate = DateTime.Now.AddMonths(-1),
                WateringFrequencyDays = 1,
                LastWateredDate = DateTime.Now,
                CareInstructions = "Needs full sun and consistent moisture. Water at the base to prevent leaf diseases. Provide trellis support. Harvest regularly to encourage more production.",
                ImageUrl = "🥒",
                SunlightRequirements = "Full sun (6-8 hours daily). Will tolerate light afternoon shade in very hot climates.",
                SoilType = "Rich, loose soil with pH 6.0-7.0. Add plenty of compost. Requires excellent drainage to prevent root diseases.",
                FertilizingSchedule = "Feed weekly with balanced fertilizer once vines start growing. Switch to low-nitrogen, high-phosphorus when flowering begins.",
                PruningTips = "Remove dead or yellowing leaves. For vining varieties, pinch off growing tips after 7 leaves to encourage lateral growth. Train on trellis vertically.",
                CommonPests = "Cucumber beetles, aphids, spider mites, powdery mildew. Use row covers early season. Spray neem oil for beetles. Ensure good air circulation.",
                HarvestingInfo = "Harvest when 6-8 inches long (50-70 days). Pick daily at peak season. Don't let cucumbers get too large (becomes bitter). Use pruning shears.",
                GrowthStages = "Days 1-7: Germination. Days 8-21: Seedling. Days 22-40: Vine development. Days 41-50: Flowering. Days 50-70: Fruiting continues throughout season."
            },
            new Plant
            {
                Id = 4,
                UserId = 1,
                Name = "Bell Peppers",
                Type = "Pepper",
                Description = "Colorful sweet bell peppers",
                PlantedDate = DateTime.Now.AddMonths(-2),
                WateringFrequencyDays = 2,
                LastWateredDate = DateTime.Now.AddDays(-2),
                CareInstructions = "Requires full sun and warm temperatures. Water regularly and deeply. Mulch to retain moisture. Stake plants if needed. Fertilize every 2-3 weeks.",
                ImageUrl = "🫑",
                SunlightRequirements = "Full sun (6-8 hours daily). Needs warm temperatures (70-85°F). Protect from strong winds.",
                SoilType = "Well-draining, nutrient-rich soil with pH 6.0-6.8. Add compost and aged manure. Sandy loam ideal.",
                FertilizingSchedule = "Fertilize every 2-3 weeks with 5-10-10 fertilizer. Avoid high nitrogen (causes foliage, not fruit). Add calcium to prevent blossom end rot.",
                PruningTips = "Pinch off first few flowers to encourage stronger plant. Remove suckers below first Y-branch. Prune damaged leaves. Stake heavy-laden plants.",
                CommonPests = "Aphids, pepper weevils, hornworms, spider mites. Check under leaves weekly. Use insecticidal soap. Companion plant with basil.",
                HarvestingInfo = "Harvest green at 60-80 days, or wait for color change (red, yellow, orange) at 80-100 days. Cut with pruning shears, don't pull. Harvest stimulates more peppers.",
                GrowthStages = "Weeks 1-4: Seedling. Weeks 5-8: Vegetative growth. Weeks 9-10: Flowering. Weeks 11-15: Green peppers ready. Weeks 16-18: Full color maturity."
            }
        );

        modelBuilder.Entity<WateringLog>().HasData(
            new WateringLog { Id = 1, PlantId = 1, WateredDate = DateTime.Now.AddDays(-3), Notes = "Deep watering" },
            new WateringLog { Id = 2, PlantId = 2, WateredDate = DateTime.Now.AddDays(-1), Notes = "Regular watering" },
            new WateringLog { Id = 3, PlantId = 3, WateredDate = DateTime.Now, Notes = "Morning watering" }
        );

        modelBuilder.Entity<CareTask>().HasData(
            new CareTask { Id = 1, PlantId = 1, TaskName = "Pruning", Description = "Prune dead branches", DueDate = DateTime.Now.AddDays(30), IsCompleted = false },
            new CareTask { Id = 2, PlantId = 2, TaskName = "Fertilize", Description = "Apply tomato fertilizer", DueDate = DateTime.Now.AddDays(7), IsCompleted = false },
            new CareTask { Id = 3, PlantId = 3, TaskName = "Check for pests", Description = "Inspect leaves for cucumber beetles", DueDate = DateTime.Now.AddDays(3), IsCompleted = false }
        );
    }
}


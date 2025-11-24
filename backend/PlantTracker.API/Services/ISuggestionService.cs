using PlantTracker.API.Models;

namespace PlantTracker.API.Services;

public interface ISuggestionService
{
    Task<PlantSuggestions> GenerateSuggestionsForPlant(Plant plant);
    Task<List<PlantSuggestions>> GenerateSuggestionsForAllPlants(int userId);
}


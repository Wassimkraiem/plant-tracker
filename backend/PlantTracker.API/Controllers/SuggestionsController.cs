using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantTracker.API.Data;
using PlantTracker.API.Models;
using PlantTracker.API.Services;
using System.Security.Claims;

namespace PlantTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SuggestionsController : ControllerBase
{
    private readonly PlantTrackerContext _context;
    private readonly ISuggestionService _suggestionService;

    public SuggestionsController(PlantTrackerContext context, ISuggestionService suggestionService)
    {
        _context = context;
        _suggestionService = suggestionService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }

    // GET: api/suggestions
    [HttpGet]
    public async Task<ActionResult<List<PlantSuggestions>>> GetAllSuggestions()
    {
        var userId = GetUserId();
        var suggestions = await _suggestionService.GenerateSuggestionsForAllPlants(userId);
        return Ok(suggestions);
    }

    // GET: api/suggestions/plant/5
    [HttpGet("plant/{plantId}")]
    public async Task<ActionResult<PlantSuggestions>> GetPlantSuggestions(int plantId)
    {
        var userId = GetUserId();
        
        var plant = await _context.Plants
            .Where(p => p.Id == plantId && p.UserId == userId)
            .Include(p => p.CareTasks)
            .Include(p => p.WateringLogs)
            .FirstOrDefaultAsync();

        if (plant == null)
        {
            return NotFound();
        }

        var suggestions = await _suggestionService.GenerateSuggestionsForPlant(plant);
        return Ok(suggestions);
    }
}


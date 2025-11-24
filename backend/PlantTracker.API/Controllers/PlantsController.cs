using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantTracker.API.Data;
using PlantTracker.API.Models;

namespace PlantTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlantsController : ControllerBase
{
    private readonly PlantTrackerContext _context;

    public PlantsController(PlantTrackerContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }

    // GET: api/plants
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Plant>>> GetPlants()
    {
        var userId = GetUserId();
        return await _context.Plants
            .Where(p => p.UserId == userId)
            .Include(p => p.WateringLogs)
            .Include(p => p.CareTasks)
            .ToListAsync();
    }

    // GET: api/plants/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Plant>> GetPlant(int id)
    {
        var userId = GetUserId();
        var plant = await _context.Plants
            .Where(p => p.UserId == userId)
            .Include(p => p.WateringLogs)
            .Include(p => p.CareTasks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (plant == null)
        {
            return NotFound();
        }

        return plant;
    }

    // POST: api/plants
    [HttpPost]
    public async Task<ActionResult<Plant>> CreatePlant(Plant plant)
    {
        var userId = GetUserId();
        plant.UserId = userId;
        _context.Plants.Add(plant);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlant), new { id = plant.Id }, plant);
    }

    // PUT: api/plants/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePlant(int id, Plant plant)
    {
        var userId = GetUserId();
        
        if (id != plant.Id)
        {
            return BadRequest();
        }

        var existingPlant = await _context.Plants.FindAsync(id);
        if (existingPlant == null || existingPlant.UserId != userId)
        {
            return NotFound();
        }

        plant.UserId = userId;
        _context.Entry(plant).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PlantExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/plants/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlant(int id)
    {
        var userId = GetUserId();
        var plant = await _context.Plants.FindAsync(id);
        if (plant == null || plant.UserId != userId)
        {
            return NotFound();
        }

        _context.Plants.Remove(plant);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/plants/5/water
    [HttpPost("{id}/water")]
    public async Task<ActionResult> WaterPlant(int id, [FromBody] WateringLog log)
    {
        var plant = await _context.Plants.FindAsync(id);
        if (plant == null)
        {
            return NotFound();
        }

        plant.LastWateredDate = log.WateredDate;
        log.PlantId = id;
        _context.WateringLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // GET: api/plants/5/watering-logs
    [HttpGet("{id}/watering-logs")]
    public async Task<ActionResult<IEnumerable<WateringLog>>> GetWateringLogs(int id)
    {
        return await _context.WateringLogs
            .Where(w => w.PlantId == id)
            .OrderByDescending(w => w.WateredDate)
            .ToListAsync();
    }

    // POST: api/plants/5/tasks
    [HttpPost("{id}/tasks")]
    public async Task<ActionResult<CareTask>> CreateCareTask(int id, CareTask task)
    {
        var plant = await _context.Plants.FindAsync(id);
        if (plant == null)
        {
            return NotFound();
        }

        task.PlantId = id;
        _context.CareTasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlant), new { id = plant.Id }, task);
    }

    // PUT: api/plants/tasks/5
    [HttpPut("tasks/{taskId}")]
    public async Task<IActionResult> UpdateCareTask(int taskId, CareTask task)
    {
        if (taskId != task.Id)
        {
            return BadRequest();
        }

        _context.Entry(task).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/plants/tasks/5
    [HttpDelete("tasks/{taskId}")]
    public async Task<IActionResult> DeleteCareTask(int taskId)
    {
        var task = await _context.CareTasks.FindAsync(taskId);
        if (task == null)
        {
            return NotFound();
        }

        _context.CareTasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PlantExists(int id)
    {
        return _context.Plants.Any(e => e.Id == id);
    }
}


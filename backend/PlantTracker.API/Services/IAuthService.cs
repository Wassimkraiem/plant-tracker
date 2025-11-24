using PlantTracker.API.Models;

namespace PlantTracker.API.Services;

public interface IAuthService
{
    Task<AuthResponse?> Register(RegisterRequest request);
    Task<AuthResponse?> Login(LoginRequest request);
    string GenerateJwtToken(User user);
}


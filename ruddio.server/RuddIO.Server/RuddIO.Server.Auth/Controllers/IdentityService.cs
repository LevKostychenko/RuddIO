using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RuddIO.Server.Auth.Services.Abstraction;

namespace RuddIO.Server.Auth.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class IdentityService(IUserIdentityService identityService) : ControllerBase
    {
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register(string password, string username)
        {
            var (recoveryKey, key) = await identityService.RegisterUserAsync(username, password);
            var keyBase64 = Convert.ToBase64String(key);

            return Ok(new
            {
                RecoveryKey = recoveryKey,
                KeyFile = keyBase64,
                FileName = $"key_{username}"
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromForm] string password, IFormFile keyFile)
        {
            var response = await identityService.LoginUserAsync(keyFile.OpenReadStream(), password);
            return Ok(response);
        }
    }
}

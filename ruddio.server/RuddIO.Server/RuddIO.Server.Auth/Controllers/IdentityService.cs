using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RuddIO.Server.Auth.Models;
using RuddIO.Server.Auth.Services.Abstraction;

namespace RuddIO.Server.Auth.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class IdentityService(IUserIdentityService identityService) : ControllerBase
    {
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] Registration registration)
        {
            var (recoveryKey, key) = await identityService.RegisterUserAsync(
                registration.Username, 
                registration.Password, 
                registration.SecretPhrase);
            var keyBase64 = Convert.ToBase64String(key);

            return Ok(new
            {
                RecoveryKey = recoveryKey,
                KeyFile = keyBase64,
                FileName = $"key_{registration.Username}"
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromForm] string password, IFormFile keyFile)
        {
            var response = await identityService.LoginUserAsync(keyFile.OpenReadStream(), password);
            return Ok(response);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> RecoverUser([FromBody] Recovery recovery)
        {
            var (newRecoveryKey, newKey) = await identityService.RecoverUserKeyAsync(
                recovery.RecoveryKey, 
                recovery.NewPassword, 
                recovery.Username, 
                recovery.SecretPhrase);
            var keyBase64 = Convert.ToBase64String(newKey);

            return Ok(new
            {
                RecoveryKey = newRecoveryKey,
                KeyFile = keyBase64,
                FileName = $"key_{recovery.Username}"
            });
        }
    }
}

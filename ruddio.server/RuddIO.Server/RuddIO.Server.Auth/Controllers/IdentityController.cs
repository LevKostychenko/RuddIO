using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RuddIO.Server.Auth.Models;
using RuddIO.Server.Auth.Services.Abstraction;
using RuddIO.Server.DB;
using System;
using System.Security.Claims;
using static System.Net.Mime.MediaTypeNames;

namespace RuddIO.Server.Auth.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IdentityController(IUserIdentityService identityService, RuddIODbContext db) : ControllerBase
    {
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] Registration registration)
        {
            if (!identityService.ValidatePassword(registration.Password))
            {
                return BadRequest("password");
            }

            if (!await identityService.ValidateUsernameAsync(registration.Username))
            {
                return BadRequest("username");
            }

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

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromForm] string password, IFormFile keyFile)
        {
            var response = await identityService.LoginUserAsync(keyFile.OpenReadStream(), password);
            return Ok(response);
        }

        [HttpPost("recover")]
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

        [HttpGet("account")]
        [Authorize]
        public async Task<IActionResult> GetAccount()
        {
            var userId = User.Claims.Single(c => c.Type == ClaimTypes.Actor).Value;
            var user = await db.Users.FindAsync(Guid.Parse(userId));
            return Ok(new
            {
                TimeZoneId = "",
                Locale = "en-US",
                Image = "",
                Id = userId,
                user.UserName
            });
        }
    }
}

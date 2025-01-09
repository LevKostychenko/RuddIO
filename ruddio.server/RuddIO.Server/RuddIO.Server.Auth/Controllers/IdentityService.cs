using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RuddIO.Server.Auth.Services.Abstraction;

namespace RuddIO.Server.Auth.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class IdentityService(IUserIdentityService identityService) : ControllerBase
    {
        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(string password, string username)
        {
            var stream = await identityService.RegisterUserAsync(username, password);
            return File(stream, "application/octet-stream");
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromForm] string password, IFormFile keyFile)
        {
            var response = await identityService.LoginUserAsync(keyFile.OpenReadStream(), password);
            return Ok(response);
        }
    }
}

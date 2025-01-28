using RuddIO.Server.SDK.Models.DTO;

namespace RuddIO.Server.Auth.Services.Abstraction
{
    public interface IUserIdentityService
    {
        Task<(string recoveryKey, byte[] key)> RecoverUserKeyAsync(string recoveryKey, string newPassword, string username, string secretPhrase);
        Task<(string recoveryKey, byte[] key)> RegisterUserAsync(string username, string password, string secretPhrase);
        Task<TokenPair> LoginUserAsync(Stream key, string password);
        bool ValidatePassword(string password);
        Task<bool> ValidateUsernameAsync(string username);
    }
}

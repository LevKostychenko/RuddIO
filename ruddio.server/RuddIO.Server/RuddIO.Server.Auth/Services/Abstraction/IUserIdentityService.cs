namespace RuddIO.Server.Auth.Services.Abstraction
{
    public interface IUserIdentityService
    {
        Task<(string recoveryKey, byte[] key)> RecoverUserKeyAsync(string recoveryKey, string newPassword, string username, string secretPhrase);
        Task<(string recoveryKey, byte[] key)> RegisterUserAsync(string username, string password, string secretPhrase);
        Task<string> LoginUserAsync(Stream key, string password);
        bool ValidatePassword(string password);
        bool ValidateUsername(string username);
    }
}

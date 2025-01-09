namespace RuddIO.Server.Auth.Services.Abstraction
{
    public interface IUserIdentityService
    {
        Task<Stream> RecoverUserKeyAsync(string recoveryKey, string newPassword);
        Task<Stream> RegisterUserAsync(string username, string password);
        Task<string> LoginUserAsync(Stream key, string password);
        bool ValidatePassword(string password);
        bool ValidateUsername(string username);
    }
}

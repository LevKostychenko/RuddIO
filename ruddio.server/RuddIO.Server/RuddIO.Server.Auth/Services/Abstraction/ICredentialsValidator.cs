namespace RuddIO.Server.Auth.Services.Abstraction
{
    public interface ICredentialsValidator
    {
        bool ValidatePassword(string password);
        bool ValidateUsername(string username);
    }
}

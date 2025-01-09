using RuddIO.Server.SDK.Models.DTO;

namespace RuddIO.Server.Auth.Services.Abstraction
{
    public interface IUserCryptoService
    {
        Task<string> GenerateRecoveryKeyAsync(Guid userId);
        Task<UserKeyContent> DecryptUserKeyAsync(byte[] fileData, string password);
        Task<byte[]> GenerateUserKeyAsync(string password, Guid userId);
    }
}

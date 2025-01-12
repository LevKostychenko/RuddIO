using RuddIO.Server.SDK.Models.DTO;

namespace RuddIO.Server.Auth.Services.Abstraction
{
    public interface IUserCryptoService
    {
        Task<string> GenerateRecoveryKeyAsync(Guid userId, string passwordHash, string secretPhrase, string keyStemp);
        Task<UserKeyContent> DecryptRecoveryKeyAsync(string encryptedRecoveryKeyBase64, string passwordHash, string secretPhrase);
        Task<UserKeyContent> DecryptUserKeyAsync(byte[] fileData, string password);
        Task<byte[]> GenerateUserKeyAsync(string password, Guid userId, string keyStemp);
        string GetPaswordHash(string password);
    }
}

using Microsoft.EntityFrameworkCore;
using RuddIO.Server.Auth.Services.Abstraction;
using RuddIO.Server.DB;
using RuddIO.Server.SDK.Models;

namespace RuddIO.Server.Auth.Services
{
    public class UserIdentityService(IUserCryptoService cryptoService, RuddIODbContext db) : IUserIdentityService
    {
        public async Task<string> LoginUserAsync(Stream key, string password)
        {
            try
            {
                var userKeyContent = await cryptoService.DecryptUserKeyAsync(StreamToBytes(key), password);
                if (userKeyContent == null)
                {
                    throw new Exception();
                }

                return userKeyContent.Id.ToString();
            }
            catch (Exception ex)
            {
                throw new UnauthorizedAccessException("Invalid key or password.", ex);
            }
        }

        public async Task<(string recoveryKey, byte[] key)> RecoverUserKeyAsync(string recoveryKey, string newPassword, string username, string secretPhrase)
        {
            try
            {
                var user = (await db.Users.SingleOrDefaultAsync(
                    u => string.Equals(u.UserName, username, StringComparison.InvariantCultureIgnoreCase))) ?? throw new Exception();

                var oldRecoveryKey = await cryptoService.DecryptRecoveryKeyAsync(recoveryKey, user.PasswordHash, secretPhrase);
                if (oldRecoveryKey != null && oldRecoveryKey.Id == user.Id && oldRecoveryKey.Stemp == user.KeyStemp.ToString())
                {
                    var newPasswordHash = cryptoService.GetPaswordHash(newPassword);
                    user.KeyStemp = Guid.NewGuid();
                    user.PasswordHash = newPasswordHash;

                    var key = await cryptoService.GenerateUserKeyAsync(newPassword, user.Id, user.KeyStemp.ToString());
                    var newRecoveryKey = await cryptoService.GenerateRecoveryKeyAsync(user.Id, newPasswordHash, secretPhrase, user.KeyStemp.ToString());

                    await db.SaveChangesAsync();

                    return (newRecoveryKey, key);
                }

                throw new Exception();
            }
            catch
            {
                throw;
            }
        }

        public async Task<(string recoveryKey, byte[] key)> RegisterUserAsync(string username, string password, string secretPhrase)
        {
            var passwordHash = cryptoService.GetPaswordHash(password);
            var user = new User
            {
                UserName = username,
                PasswordHash = passwordHash,
                KeyStemp = Guid.NewGuid(),
            };

            await db.Database.BeginTransactionAsync();
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            try
            {
                var key = await cryptoService.GenerateUserKeyAsync(password, user.Id, user.KeyStemp.ToString());
                var recoveryKey = await cryptoService.GenerateRecoveryKeyAsync(user.Id, passwordHash, secretPhrase, user.KeyStemp.ToString());
                return (recoveryKey, key);
            }
            catch
            {
                await db.Database.RollbackTransactionAsync();
                throw;
            }
        }

        public bool ValidateUsername(string username)
        {
            throw new NotImplementedException();
        }

        public bool ValidatePassword(string password)
        {
            throw new NotImplementedException();
        }

        private byte[] StreamToBytes(Stream stream)
        {
            byte[] bytes;
            using (var binaryReader = new BinaryReader(stream))
            {
                bytes = binaryReader.ReadBytes((int)stream.Length);
            }
            return bytes;
        }
    }
}

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

        public Task<Stream> RecoverUserKeyAsync(string recoveryKey, string newPassword)
        {
            throw new NotImplementedException();
        }

        public async Task<Stream> RegisterUserAsync(string username, string password)
        {
            var user = new User
            {
                UserName = username
            };

            await db.Database.BeginTransactionAsync();
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            try
            {
                var key = await cryptoService.GenerateUserKeyAsync(password, user.Id);
                return await BytesToStreamAsync(key);
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

        private async Task<Stream> BytesToStreamAsync(byte[] bytes)
        {
            await using (var fs = new FileStream("ruddio-key", FileMode.Create, FileAccess.Write))
            {
                await fs.WriteAsync(bytes, 0, bytes.Length);
                return fs;
            }
        }
    }
}

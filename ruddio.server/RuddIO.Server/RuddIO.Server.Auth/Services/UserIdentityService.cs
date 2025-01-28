using Microsoft.EntityFrameworkCore;
using RuddIO.Server.Auth.Services.Abstraction;
using RuddIO.Server.DB;
using RuddIO.Server.SDK.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using RuddIO.Server.SDK.Models.DTO;
using Microsoft.Extensions.Options;
using RuddIO.Server.Auth.Models;

namespace RuddIO.Server.Auth.Services
{
    public class UserIdentityService(
        IUserCryptoService cryptoService, 
        RuddIODbContext db,
        ITokenService tokenService,
        IOptions<JwtTokenOptions> tokenOptions,
        ICredentialsValidator validator) : IUserIdentityService
    {
        public async Task<TokenPair> LoginUserAsync(Stream key, string password)
        {
            try
            {
                var userKeyContent = await cryptoService.DecryptUserKeyAsync(StreamToBytes(key), password) ?? throw new Exception();
                var user = await db.Users.FindAsync(userKeyContent.Id);

                return user == null ? throw new Exception() : await AuthenticateAsync(user);
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
                var user = (await db.Users.SingleOrDefaultAsync(u => u.UserName == username)) ?? throw new Exception();

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
                await db.Database.CommitTransactionAsync();
                return (recoveryKey, key);
            }
            catch
            {
                await db.Database.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<bool> ValidateUsernameAsync(string username)
        {
            return !await db.Users.AnyAsync(u => u.UserName == username)
                && validator.ValidateUsername(username);
        }

        public bool ValidatePassword(string password)
        {
            return validator.ValidatePassword(password);
        }

        private static byte[] StreamToBytes(Stream stream)
        {
            byte[] bytes;
            using (var binaryReader = new BinaryReader(stream))
            {
                bytes = binaryReader.ReadBytes((int)stream.Length);
            }
            return bytes;
        }

        private async Task<TokenPair> AuthenticateAsync(User user)
        {
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Actor, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
       
            var token = tokenService.CreateAccessToken(authClaims);
            var refreshToken = tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(tokenOptions.Value.RefreshTokenExpireDays);

            await db.SaveChangesAsync();
            return new TokenPair
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refreshToken,
                AccessTokenExpiration = token.ValidTo,
                RefreshTokenExpiration = user.RefreshTokenExpiryTime
            };
        }
    }
}

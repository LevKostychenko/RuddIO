using RuddIO.Server.Auth.Services.Abstraction;
using RuddIO.Server.SDK.Models.DTO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace RuddIO.Server.Auth.Services
{
    public class UserCryptoService(byte saltSize, int keyGeneratorIterations, byte keySize) : IUserCryptoService
    {
        public async Task<byte[]> GenerateUserKeyAsync(string password, Guid userId)
        {
            var salt = GenerateSalt();
            var key = DeriveKey(password, salt);

            var userData = new UserKeyContent
            {
                Id = userId,
                TimeStamp = DateTime.UtcNow,
            };
            var encryptedData = await EncryptDataAsync(userData, key);

            var fileData = new byte[salt.Length + encryptedData.Length];
            Buffer.BlockCopy(salt, 0, fileData, 0, salt.Length);
            Buffer.BlockCopy(encryptedData, 0, fileData, salt.Length, encryptedData.Length);

            return fileData;
        }

        public async Task<UserKeyContent> DecryptUserKeyAsync(byte[] fileData, string password)
        {
            var salt = new byte[saltSize];
            var encryptedData = new byte[fileData.Length - saltSize];
            Buffer.BlockCopy(fileData, 0, salt, 0, saltSize);
            Buffer.BlockCopy(fileData, saltSize, encryptedData, 0, encryptedData.Length);

            var key = DeriveKey(password, salt);
            return await DecryptDataAsync(encryptedData, key);
        }

        private string HashRecoveryKey(string recoveryKey)
        {
            using var sha256 = SHA256.Create();
            var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(recoveryKey));
            return Convert.ToBase64String(hash);
        }

        public async Task<string> GenerateRecoveryKeyAsync(Guid userId)
        {
            var recoveryData = new UserKeyContent
            {
                Id = userId,
                TimeStamp = DateTime.UtcNow
            };

            var recoveryKey = GenerateSecureRandomKey();
            var recoveryKeyBytes = Encoding.UTF8.GetBytes(recoveryKey);

            var encryptedRecoveryKey = await EncryptDataAsync(recoveryData, recoveryKeyBytes);

            return Convert.ToBase64String(encryptedRecoveryKey);
        }

        public string GetPaswordHash(string password)
        {
            var salt = GenerateSalt();
            var hash = DeriveKey(password, salt);
            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
        }

        public bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2)
            {
                throw new FormatException("Invalid hash format.");
            }

            var salt = Convert.FromBase64String(parts[0]);
            var hash = Convert.FromBase64String(parts[1]);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, keyGeneratorIterations, HashAlgorithmName.SHA256);
            var computedHash = pbkdf2.GetBytes(keySize);

            return CryptographicOperations.FixedTimeEquals(computedHash, hash);
        }

        protected virtual byte[] GenerateSalt()
        {
            var salt = GenerateRandomBytes(saltSize);
            return salt;
        }

        private string GenerateSecureRandomKey()
        {
            var bytes = GenerateRandomBytes(32);
            return Convert.ToBase64String(bytes);
        }

        private byte[] GenerateRandomBytes(byte length)
        {
            var bytes = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return bytes;
        }

        private byte[] DeriveKey(string password, byte[] salt)
        {
            using var pbkdf2 = new Rfc2898DeriveBytes(
                password, 
                salt, 
                keyGeneratorIterations, 
                HashAlgorithmName.SHA256);
            return pbkdf2.GetBytes(keySize);
        }

        private async Task<byte[]> EncryptDataAsync(object data, byte[] key)
        {
            var dataJson = JsonSerializer.Serialize(data);
            using var aes = Aes.Create();
            aes.Key = key;
            aes.GenerateIV();

            using var encryptor = aes.CreateDecryptor();
            await using var ms = new MemoryStream();
            await using (var cryptoStream = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            {
                ms.Write(aes.IV, 0, aes.IV.Length);
                await using var sw = new StreamWriter(cryptoStream);
                sw.Write(dataJson);
            }

            return ms.ToArray();
        }

        private async Task<UserKeyContent> DecryptDataAsync(byte[] encryptedData, byte[] key)
        {
            using var aes = Aes.Create();
            aes.Key = key;

            await using var ms = new MemoryStream(encryptedData);
            var iv = new byte[aes.BlockSize / 8];
            await ms.ReadAsync(iv, 0, iv.Length);
            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor();
            await using var cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
            using var sr = new StreamReader(cryptoStream);
            var json = sr.ReadToEnd();

            return JsonSerializer.Deserialize<UserKeyContent>(json);
        }
    }
}

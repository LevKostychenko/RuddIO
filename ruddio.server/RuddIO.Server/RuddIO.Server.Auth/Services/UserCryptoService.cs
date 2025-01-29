using RuddIO.Server.Auth.Services.Abstraction;
using RuddIO.Server.SDK.Models.DTO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace RuddIO.Server.Auth.Services
{
    public class UserCryptoService(byte saltSize, int keyGeneratorIterations, byte keySize) : IUserCryptoService
    {
        public async Task<byte[]> GenerateUserKeyAsync(string password, Guid userId, string keyStemp)
        {
            var salt = GenerateSalt();
            var key = DeriveKey(password, salt);

            var userData = new UserKeyContent
            {
                Id = userId,
                TimeStamp = DateTime.UtcNow,
                Stemp = keyStemp
            };
            var dataJson = JsonSerializer.Serialize(userData);
            var encryptedData = await EncryptDataAsync(dataJson, key);

            var fileData = new byte[salt.Length + encryptedData.Length];
            Buffer.BlockCopy(salt, 0, fileData, 0, salt.Length);
            Buffer.BlockCopy(encryptedData, 0, fileData, salt.Length, encryptedData.Length);

            return fileData;
        }

        public async Task<UserKeyContent> DecryptUserKeyAsync(string base64File, string password)
        {
            var fileData = Convert.FromBase64String(base64File);
            var salt = new byte[saltSize];
            var encryptedData = new byte[fileData.Length - saltSize];
            Buffer.BlockCopy(fileData, 0, salt, 0, saltSize);
            Buffer.BlockCopy(fileData, saltSize, encryptedData, 0, encryptedData.Length);

            var key = DeriveKey(password, salt);
            var json = await DecryptDataAsync(encryptedData, key);

            return JsonSerializer.Deserialize<UserKeyContent>(json);
        }

        public async Task<string> GenerateRecoveryKeyAsync(Guid userId, string passwordHash, string secretPhrase, string keyStemp)
        {
            var userData = new UserKeyContent
            {
                Id = userId,
                TimeStamp = DateTime.UtcNow,
                Stemp = keyStemp,
            };
            var dataJson = JsonSerializer.Serialize(userData);
            var encryptionKey = GenerateEncryptionKey(passwordHash, secretPhrase);
            var encryptedRecoveryKey = await EncryptDataAsync(dataJson, encryptionKey);

            return Convert.ToBase64String(encryptedRecoveryKey);
        }

        public async Task<UserKeyContent> DecryptRecoveryKeyAsync(string encryptedRecoveryKeyBase64, string passwordHash, string secretPhrase)
        {
            var encryptedRecoveryKey = Convert.FromBase64String(encryptedRecoveryKeyBase64);
            var decryptionKey = GenerateEncryptionKey(passwordHash, secretPhrase);
            var json = await DecryptDataAsync(encryptedRecoveryKey, decryptionKey);

            return JsonSerializer.Deserialize<UserKeyContent>(json);
        }

        public string GetPaswordHash(string password)
        {
            var salt = GenerateSalt();
            var hash = DeriveKey(password, salt);
            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
        }

        protected virtual byte[] GenerateSalt()
        {
            var salt = GenerateRandomBytes(saltSize);
            return salt;
        }

        private byte[] GenerateEncryptionKey(string password, string secretPhrase, int keySize = 32)
        {
            var combined = Encoding.UTF8.GetBytes(secretPhrase + password);

            var hash = SHA256.HashData(combined);
            return hash.Take(keySize).ToArray();
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

        private async Task<byte[]> EncryptDataAsync(string data, byte[] key)
        {
            using var aes = Aes.Create();
            aes.Key = key;
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor();
            await using var ms = new MemoryStream();
            await using (var cryptoStream = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            {
                ms.Write(aes.IV, 0, aes.IV.Length);
                await using var sw = new StreamWriter(cryptoStream);
                sw.Write(data);
            }

            return ms.ToArray();
        }

        private async Task<string> DecryptDataAsync(byte[] encryptedData, byte[] key)
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
            return sr.ReadToEnd();
        }
    }
}

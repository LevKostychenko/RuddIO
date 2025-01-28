using RuddIO.Server.SDK.Models.Base;

namespace RuddIO.Server.SDK.Models
{
    public class User : BaseEntity
    {
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public Guid KeyStemp { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}

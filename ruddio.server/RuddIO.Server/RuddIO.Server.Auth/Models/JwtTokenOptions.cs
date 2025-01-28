namespace RuddIO.Server.Auth.Models
{
    public class JwtTokenOptions
    {
        public string SecretKey { get; set; }
        public string Issuer { get; set; } = "RuddIO";
        public string Audience { get; set; } = "Users";
        public string LoginProvider { get; set; } = "RuddIO";
        public int AccessTokenExpireMinutes { get; set; } = 60;
        public int RefreshTokenExpireDays { get; set; } = 30 * 6;
    }
}

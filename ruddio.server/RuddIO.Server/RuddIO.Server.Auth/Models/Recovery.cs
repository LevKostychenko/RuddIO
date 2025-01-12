namespace RuddIO.Server.Auth.Models
{
    public class Recovery
    {
        public string RecoveryKey { get; set; }
        public string NewPassword { get; set; }
        public string Username { get; set; }
        public string SecretPhrase { get; set; }
    }
}

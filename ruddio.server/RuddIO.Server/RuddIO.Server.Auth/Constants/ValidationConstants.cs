namespace RuddIO.Server.Auth.Constants
{
    public static class ValidationConstants
    {
        public static readonly IEnumerable<string> PasswordRules =
        [
            @"^.{8,}$",
            @"[A-Za-z]",
            @"\d",
            @"[^\w\s]"
        ];

        public static readonly IEnumerable<string> UsernameRules =
        [
            @"^[a-zA-Z0-9]+$",
            @"^.{2,16}$"
        ];
    }
}

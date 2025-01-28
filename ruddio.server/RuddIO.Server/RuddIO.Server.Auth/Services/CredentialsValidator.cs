using RuddIO.Server.Auth.Services.Abstraction;
using System.Text.RegularExpressions;

namespace RuddIO.Server.Auth.Services
{
    public class CredentialsValidator(IEnumerable<string> usernameRules, IEnumerable<string> passwordRules) : ICredentialsValidator
    {
        public bool ValidatePassword(string password) => Validate(password, passwordRules);

        public bool ValidateUsername(string username) => Validate(username, usernameRules);

        private bool Validate(string input, IEnumerable<string> rules)
        {
            foreach (var rule in rules)
            {
                if (!Regex.IsMatch(input, rule))
                {
                    return false;
                }
            }

            return true;
        }
    }
}

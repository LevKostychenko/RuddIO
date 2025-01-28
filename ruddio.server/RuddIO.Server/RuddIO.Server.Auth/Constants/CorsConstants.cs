using Microsoft.Net.Http.Headers;

namespace RuddIO.Server.Auth.Constants
{
    public static class CorsConstants
    {
        public const string CORS_POLICY = "RuddIOCorsPolicy";

        public static readonly string[] CorsExposedHeaders =
        [
            TokenConstants.TokenExpiredHeader,
            HeaderNames.WWWAuthenticate
        ];
    }
}

using RuddIO.Server.Auth.Constants;

namespace RuddIO.Server.Auth.Extensions
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddCorsConfiguration(
            this IServiceCollection services, 
            IConfiguration configuration, 
            string corsSectionName = "CorsOrigins")
        {
            string[] origins = [.. configuration.GetSection(corsSectionName).Get<List<string>>()];
            services.AddCors(o => 
            {
                o.AddPolicy(CorsConstants.CORS_POLICY, policy =>
                {
                    policy.WithOrigins(origins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetPreflightMaxAge(TimeSpan.FromSeconds(1000.0));
                });
            });
            return services;
        }
    }
}

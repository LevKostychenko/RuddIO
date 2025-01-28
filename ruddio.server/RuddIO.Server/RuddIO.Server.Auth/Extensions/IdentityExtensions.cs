using Microsoft.IdentityModel.Tokens;
using System.Text;
using RuddIO.Server.Auth.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using RuddIO.Server.Auth.Constants;

namespace RuddIO.Server.Auth.Extensions
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddIdentityAuthentication(
            this IServiceCollection services,
            JwtTokenOptions tokenOptions)
            => services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.Zero,

                        ValidAudience = tokenOptions.Audience,
                        ValidIssuer = tokenOptions.Issuer,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.SecretKey))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            if (context.Exception is SecurityTokenExpiredException)
                            {
                                context.Response.Headers.Append(
                                    TokenConstants.TokenExpiredHeader,
                                    TokenConstants.TokenExpiredHeaderValue);
                            }

                            return Task.CompletedTask;
                        },
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                })
                .Services;
    }
}

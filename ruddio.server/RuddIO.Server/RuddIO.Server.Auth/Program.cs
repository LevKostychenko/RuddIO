using Microsoft.EntityFrameworkCore;
using RuddIO.Server.Auth.Constants;
using RuddIO.Server.Auth.Extensions;
using RuddIO.Server.Auth.Models;
using RuddIO.Server.Auth.Services;
using RuddIO.Server.Auth.Services.Abstraction;
using RuddIO.Server.DB;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<RuddIODbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("RuddIODb"));
});

var tokenConfig = builder.Configuration.GetSection("TokenOptions");
builder.Services.Configure<JwtTokenOptions>(tokenConfig);
builder.Services.AddIdentityAuthentication(tokenConfig.Get<JwtTokenOptions>());

builder.Services.AddTransient<IUserCryptoService>((_) => new UserCryptoService(16, 100000, 32));
builder.Services.AddTransient<IUserIdentityService, UserIdentityService>();
builder.Services.AddTransient<ITokenService, TokenService>();

builder.Services.AddTransient<ICredentialsValidator>(
    (_) => new CredentialsValidator(ValidationConstants.UsernameRules, ValidationConstants.PasswordRules));

builder.Services.AddCorsConfiguration(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(RuddIO.Server.Auth.Constants.CorsConstants.CORS_POLICY);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

using Microsoft.EntityFrameworkCore;
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

builder.Services.AddTransient<IUserCryptoService>((_) => new UserCryptoService(16, 100000, 32));
builder.Services.AddTransient<IUserIdentityService, UserIdentityService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

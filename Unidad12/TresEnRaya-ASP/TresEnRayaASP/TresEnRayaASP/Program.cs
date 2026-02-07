using TresEnRayaASP.Entities;
using TresEnRayaASP.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyMethod()
              .AllowAnyHeader()
              .SetIsOriginAllowed(_ => true)
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

app.MapHub<JuegoHub>("/gameHub");

app.MapGet("/", () => "Servidor de Tres en Raya funcionando. Conecta a /gameHub");

app.Run();

using TresEnRayaASP.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

// ✅ CORS CORRECTO - CON AllowCredentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:8081",
                  "https://localhost:8081"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();  
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");
app.MapHub<JuegoHub>("/gameHub");
app.MapGet("/", () => "Servidor funcionando");

app.Run();
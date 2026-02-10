using TresEnRayaASP.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

// ... (resto de usings)

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        // Esta línea permite que Expo, tu móvil o cualquier navegador se conecte
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Esto es vital para SignalR
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy"); // Asegúrate de que esté ANTES de MapHub

app.MapHub<JuegoHub>("/gameHub");
// ...
app.MapGet("/", () => "Servidor funcionando");

app.Run();
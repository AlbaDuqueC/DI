using TresEnRayaASP.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

// 🔧 CORS CORREGIDO - SIN AllowCredentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)  // Permitir cualquier origen
              .AllowAnyMethod()
              .AllowAnyHeader();
        // ❌ NO incluir .AllowCredentials() - incompatible con SetIsOriginAllowed
    });
});

var app = builder.Build();

// ✅ UseCors ANTES de MapHub
app.UseCors("CorsPolicy");

app.MapHub<JuegoHub>("/gameHub");

app.MapGet("/", () => "Servidor funcionando");

app.Run();
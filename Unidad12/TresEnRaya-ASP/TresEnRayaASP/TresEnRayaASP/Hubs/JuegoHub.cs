using Microsoft.AspNetCore.SignalR;
using TresEnRayaASP.Entities;

namespace TresEnRayaASP.Hubs;

public class JuegoHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        GameInfo.numJugadores++;

        if (GameInfo.numJugadores == 1)
        {
            await Clients.Caller.SendAsync("Mensaje", "Esperando oponente...");
        }
        else if (GameInfo.numJugadores == 2)
        {
            GameInfo.StartGame();
            await Clients.All.SendAsync("Mensaje", "¡Juego iniciado!");
        }
        else
        {
            GameInfo.numJugadores--;
            await Clients.Caller.SendAsync("Error", "Juego completo");
        }

        await base.OnConnectedAsync();
    }

    public async Task SendMove(Jugada jugada)
    {
        int fila = jugada.movimiento[0];
        int columna = jugada.movimiento[1];

        GameInfo.Jugada(fila, columna);

        await Clients.All.SendAsync("MovimientoRealizado", new
        {
            tablero = GameInfo.tablero,
            ganador = GameInfo.ganador
        });
    }
}
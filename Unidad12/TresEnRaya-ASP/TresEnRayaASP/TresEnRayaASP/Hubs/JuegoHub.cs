using Microsoft.AspNetCore.SignalR;
using System;
using TresEnRayaASP.Entities;

namespace TresEnRayaASP.Hubs;

public class JuegoHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        lock (GameInfo._lock)
        {
            GameInfo.conexiones.RemoveAll(id => string.IsNullOrEmpty(id));
            if (GameInfo.conexiones.Count < 2 && !GameInfo.conexiones.Contains(Context.ConnectionId))
            {
                GameInfo.conexiones.Add(Context.ConnectionId);
            }
            else if (GameInfo.conexiones.Count >= 2)
            {
                _ = Clients.Caller.SendAsync("Error", "Partida llena");
                return;
            }
        }

        // FIX: Esperamos un poco para que el cliente termine de conectar del todo
        _ = Task.Run(async () => {
            await Task.Delay(500);

            if (GameInfo.conexiones.Count == 1)
            {
                await Clients.Caller.SendAsync("AsignarSimbolo", "X");
            }
            else if (GameInfo.conexiones.Count == 2)
            {
                await Clients.Client(GameInfo.conexiones[0]).SendAsync("AsignarSimbolo", "X");
                await Clients.Client(GameInfo.conexiones[1]).SendAsync("AsignarSimbolo", "O");
                await Clients.All.SendAsync("JuegoIniciado", new
                {
                    tablero = GameInfo.tablero,
                    turno = GameInfo.turnoActual
                });
            }
        });
    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            bool eraJugadorActivo = false;

            lock (GameInfo._lock)
            {
                if (GameInfo.conexiones.Contains(Context.ConnectionId))
                {
                    eraJugadorActivo = true;
                    GameInfo.conexiones.Remove(Context.ConnectionId);
                    GameInfo.numJugadores = GameInfo.conexiones.Count;

                    // Si alguien se va, reseteamos para que el que se quede (o el nuevo) pueda empezar de cero
                    GameInfo.ReiniciarJuego();
                }
            }

            if (eraJugadorActivo)
            {
                await Clients.All.SendAsync("JugadorDesconectado", new
                {
                    mensaje = "Tu oponente se ha ido. El juego se ha reiniciado."
                });
            }

            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en OnDisconnected: {ex.Message}");
        }
    }

    public async Task SendMove(Jugada jugada)
    {
        try
        {
            string simboloJugador = "";
            bool esTurnoValido = false;

            lock (GameInfo._lock)
            {
                if (!GameInfo.juegoIniciado || GameInfo.juegoTerminado) return;

                // Corregido: Usamos 'indice' en ambos sitios
                int indice = GameInfo.conexiones.IndexOf(Context.ConnectionId);
                if (indice == -1) return;

                simboloJugador = (indice == 0) ? "X" : "O";

                if (simboloJugador == GameInfo.turnoActual)
                {
                    esTurnoValido = true;
                    // Ejecuta la lógica
                    GameInfo.Jugada(jugada.movimiento[0], jugada.movimiento[1]);
                }
            }

            if (!esTurnoValido)
            {
                await Clients.Caller.SendAsync("Error", "No es tu turno.");
                return;
            }

            // Notificar a todos (FUERA del lock)
            await Clients.All.SendAsync("ActualizarTablero", new
            {
                tablero = GameInfo.tablero,
                turno = GameInfo.turnoActual,
                juegoTerminado = GameInfo.juegoTerminado,
                ganador = GameInfo.ganador
            });

            if (GameInfo.juegoTerminado)
            {
                await Clients.All.SendAsync("JuegoTerminado", new
                {
                    mensaje = GameInfo.ganador == null ? "¡Empate!" : $"¡Ganador: {GameInfo.ganador}!",
                    ganador = GameInfo.ganador
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en SendMove: {ex.Message}");
        }
    }

    public async Task ReiniciarJuego()
    {
        GameInfo.ReiniciarJuego();
        await Clients.All.SendAsync("JuegoReiniciado", new { mensaje = "Juego reiniciado." });
    }
}

// Asegúrate de que esta clase coincida con el objeto que mandas desde React
public class Jugada
{
    public int[] movimiento { get; set; } = new int[2];
}
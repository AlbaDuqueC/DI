using Microsoft.AspNetCore.SignalR;
using TresEnRayaASP.Entities;

namespace TresEnRayaASP.Hubs;

public class JuegoHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        string connectionId = Context.ConnectionId;

        Console.WriteLine($"");
        Console.WriteLine($"╔═══════════════════════════════════════╗");
        Console.WriteLine($"║  NUEVA CONEXIÓN DETECTADA             ║");
        Console.WriteLine($"╚═══════════════════════════════════════╝");
        Console.WriteLine($"🆔 Connection ID: {connectionId}");

        bool esPrimerJugador = false;
        bool esSegundoJugador = false;
        bool partidaLlena = false;

        lock (GameInfo._lock)
        {
            // Limpieza básica de la lista
            GameInfo.conexiones.RemoveAll(string.IsNullOrEmpty);

            if (GameInfo.conexiones.Count >= 2)
            {
                Console.WriteLine($"❌ PARTIDA LLENA");
                partidaLlena = true;
            }
            else if (!GameInfo.conexiones.Contains(connectionId))
            {
                GameInfo.conexiones.Add(connectionId);
                esPrimerJugador = GameInfo.conexiones.Count == 1;
                esSegundoJugador = GameInfo.conexiones.Count == 2;
            }
        }

        await base.OnConnectedAsync();

        if (partidaLlena)
        {
            await Clients.Caller.SendAsync("PartidaLlena", new { mensaje = "Partida llena" });
            return;
        }

        if (esPrimerJugador)
        {
            await Clients.Caller.SendAsync("AsignarSimbolo", "X");
            await Clients.Caller.SendAsync("EsperarOponente", new
            {
                simbolo = "X",
                mensaje = "Esperando al segundo jugador..."
            });
        }
        else if (esSegundoJugador)
        {
            lock (GameInfo._lock)
            {
                GameInfo.StartGame();
            }

            await Clients.Caller.SendAsync("AsignarSimbolo", "O");

            await Clients.All.SendAsync("JuegoIniciado", new
            {
                tablero = GameInfo.tablero,
                turno = GameInfo.turnoActual,
                mensaje = "¡El juego ha comenzado!"
            });
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        string connectionId = Context.ConnectionId;
        bool debeNotificar = false;

        lock (GameInfo._lock)
        {
            if (GameInfo.conexiones.Contains(connectionId))
            {
                GameInfo.conexiones.Remove(connectionId);
                debeNotificar = GameInfo.conexiones.Count > 0;

                if (GameInfo.juegoIniciado)
                {
                    // Reiniciamos usando la nueva estructura escalonada
                    GameInfo.tablero = new string[3][] { new string[3], new string[3], new string[3] };
                    GameInfo.turnoActual = "X";
                    GameInfo.juegoIniciado = false;
                    GameInfo.juegoTerminado = false;
                    GameInfo.ganador = null;
                }
            }
        }

        if (debeNotificar)
        {
            await Clients.All.SendAsync("JugadorDesconectado", new { mensaje = "Oponente desconectado" });
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMove(Jugada jugada)
    {
        if (jugada?.movimiento == null || jugada.movimiento.Length != 2)
        {
            await Clients.Caller.SendAsync("Error", "Movimiento inválido");
            return;
        }

        int fila = jugada.movimiento[0];
        int columna = jugada.movimiento[1];
        string? mensajeError = null;
        bool juegoTerminado = false;
        string? ganadorFinal = null;

        lock (GameInfo._lock)
        {
            if (!GameInfo.juegoIniciado) mensajeError = "El juego no ha iniciado";
            else if (GameInfo.juegoTerminado) mensajeError = "El juego ya terminó";
            else
            {
                int indice = GameInfo.conexiones.IndexOf(Context.ConnectionId);
                string simboloJugador = (indice == 0) ? "X" : "O";

                if (indice == -1) mensajeError = "No estás en esta partida";
                else if (simboloJugador != GameInfo.turnoActual) mensajeError = "No es tu turno";
                // CORRECCIÓN: Acceso escalonado tablero[fila][columna]
                else if (GameInfo.tablero[fila][columna] != null) mensajeError = "Casilla ocupada";
                else
                {
                    GameInfo.Jugada(fila, columna);
                    juegoTerminado = GameInfo.juegoTerminado;
                    ganadorFinal = GameInfo.ganador;
                }
            }
        }

        if (mensajeError != null)
        {
            await Clients.Caller.SendAsync("Error", mensajeError);
            return;
        }

        await Clients.All.SendAsync("ActualizarTablero", new
        {
            tablero = GameInfo.tablero,
            turno = GameInfo.turnoActual,
            juegoTerminado = juegoTerminado,
            ganador = ganadorFinal
        });

        if (juegoTerminado)
        {
            string mensaje = ganadorFinal == null ? "¡Empate!" : $"¡Ganó {ganadorFinal}!";
            await Clients.All.SendAsync("JuegoTerminado", new
            {
                mensaje = mensaje,
                ganador = ganadorFinal,
                tablero = GameInfo.tablero
            });
        }
    }

    public async Task ReiniciarJuego()
    {
        bool juegoIniciadoLocal = false;

        lock (GameInfo._lock)
        {
            // CORRECCIÓN: Reinicio con array escalonado
            GameInfo.tablero = new string[3][] { new string[3], new string[3], new string[3] };
            GameInfo.turnoActual = "X";
            GameInfo.juegoTerminado = false;
            GameInfo.ganador = null;
            GameInfo.juegoIniciado = GameInfo.conexiones.Count == 2;
            juegoIniciadoLocal = GameInfo.juegoIniciado;
        }

        await Clients.All.SendAsync("JuegoReiniciado", new
        {
            mensaje = "Juego reiniciado",
            tablero = GameInfo.tablero,
            turno = GameInfo.turnoActual,
            juegoIniciado = juegoIniciadoLocal
        });
    }
}
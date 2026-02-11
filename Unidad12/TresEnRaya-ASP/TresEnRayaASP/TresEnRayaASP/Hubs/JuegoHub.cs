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

        lock (GameInfo._lock)
        {
            GameInfo.conexiones.RemoveAll(string.IsNullOrEmpty);

            Console.WriteLine($"📊 Jugadores ANTES: {GameInfo.conexiones.Count}");

            if (GameInfo.conexiones.Count >= 2)
            {
                Console.WriteLine($"❌ PARTIDA LLENA");
                await Clients.All.SendAsync("PartidaLlena", new { mensaje = "Partida llena" });
                return;
            }

            if (!GameInfo.conexiones.Contains(connectionId))
            {
                GameInfo.conexiones.Add(connectionId);
                esPrimerJugador = GameInfo.conexiones.Count == 1;
                esSegundoJugador = GameInfo.conexiones.Count == 2;

                Console.WriteLine($"✅ Jugador agregado. Total: {GameInfo.conexiones.Count}");
                Console.WriteLine($"🎯 Primer jugador: {esPrimerJugador}");
                Console.WriteLine($"🎯 Segundo jugador: {esSegundoJugador}");
            }
        }

        await base.OnConnectedAsync();

        if (esPrimerJugador)
        {
            Console.WriteLine($"👤 PROCESANDO PRIMER JUGADOR (X)");
            await Clients.Caller.SendAsync("AsignarSimbolo", "X");
            await Clients.Caller.SendAsync("EsperarOponente", new
            {
                simbolo = "X",
                mensaje = "Esperando al segundo jugador..."
            });
            Console.WriteLine($"✅ Eventos enviados al primer jugador");
        }
        else if (esSegundoJugador)
        {
            Console.WriteLine($"🎮 PROCESANDO SEGUNDO JUGADOR (O)");

            lock (GameInfo._lock)
            {
                GameInfo.StartGame();
            }

            // ✅ SOLO enviar O al segundo jugador (el primero YA tiene X)
            await Clients.Caller.SendAsync("AsignarSimbolo", "O");
            Console.WriteLine($"✅ Símbolo O enviado al segundo jugador");

            // Notificar inicio a TODOS
            await Clients.All.SendAsync("JuegoIniciado", new
            {
                tablero = GameInfo.tablero,
                turno = GameInfo.turnoActual,
                mensaje = "¡El juego ha comenzado!"
            });
            Console.WriteLine($"✅ JuegoIniciado enviado a todos");
        }

        Console.WriteLine($"✅ OnConnectedAsync COMPLETADO");
        Console.WriteLine($"═══════════════════════════════════════");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        string connectionId = Context.ConnectionId;

        Console.WriteLine($"");
        Console.WriteLine($"╔═══════════════════════════════════════╗");
        Console.WriteLine($"║  DESCONEXIÓN DETECTADA                ║");
        Console.WriteLine($"╚═══════════════════════════════════════╝");
        Console.WriteLine($"🆔 Connection ID: {connectionId}");

        lock (GameInfo._lock)
        {
            if (GameInfo.conexiones.Contains(connectionId))
            {
                GameInfo.conexiones.Remove(connectionId);
                Console.WriteLine($"✅ Jugador removido. Restantes: {GameInfo.conexiones.Count}");

                if (GameInfo.juegoIniciado)
                {
                    GameInfo.tablero = new string[3, 3];
                    GameInfo.turnoActual = "X";
                    GameInfo.juegoIniciado = false;
                    GameInfo.juegoTerminado = false;
                    GameInfo.ganador = null;
                    Console.WriteLine($"🔄 Juego reiniciado");
                }
            }
        }

        if (GameInfo.conexiones.Count > 0)
        {
            await Clients.All.SendAsync("JugadorDesconectado", new
            {
                mensaje = "Oponente desconectado"
            });
        }

        await base.OnDisconnectedAsync(exception);
        Console.WriteLine($"✅ OnDisconnectedAsync COMPLETADO");
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

        Console.WriteLine($"🎯 SendMove: [{fila}, {columna}] de {Context.ConnectionId}");

        if (fila < 0 || fila > 2 || columna < 0 || columna > 2)
        {
            await Clients.Caller.SendAsync("Error", "Posición fuera de rango");
            return;
        }

        string simboloJugador = "";
        bool movimientoValido = false;
        bool juegoTerminado = false;
        string? ganadorFinal = null;
        string? mensajeError = null;

        lock (GameInfo._lock)
        {
            if (!GameInfo.juegoIniciado)
            {
                mensajeError = "El juego no ha iniciado";
            }
            else if (GameInfo.juegoTerminado)
            {
                mensajeError = "El juego ya terminó";
            }
            else
            {
                int indice = GameInfo.conexiones.IndexOf(Context.ConnectionId);
                if (indice == -1)
                {
                    mensajeError = "No estás en esta partida";
                }
                else
                {
                    simboloJugador = (indice == 0) ? "X" : "O";

                    if (simboloJugador != GameInfo.turnoActual)
                    {
                        mensajeError = "No es tu turno";
                    }
                    else if (GameInfo.tablero[fila, columna] != null)
                    {
                        mensajeError = "Casilla ocupada";
                    }
                    else
                    {
                        movimientoValido = true;
                        GameInfo.Jugada(fila, columna);
                        juegoTerminado = GameInfo.juegoTerminado;
                        ganadorFinal = GameInfo.ganador;
                        Console.WriteLine($"✅ Movimiento válido: {simboloJugador} en [{fila}, {columna}]");
                    }
                }
            }
        }

        if (mensajeError != null)
        {
            await Clients.Caller.SendAsync("Error", mensajeError);
            return;
        }

        if (!movimientoValido) return;

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
            Console.WriteLine($"🏁 {mensaje}");

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
        Console.WriteLine($"🔄 Reinicio solicitado por: {Context.ConnectionId}");

        lock (GameInfo._lock)
        {
            GameInfo.tablero = new string[3, 3];
            GameInfo.turnoActual = "X";
            GameInfo.juegoTerminado = false;
            GameInfo.ganador = null;
            GameInfo.juegoIniciado = GameInfo.conexiones.Count == 2;
        }

        await Clients.All.SendAsync("JuegoReiniciado", new
        {
            mensaje = "Juego reiniciado",
            tablero = GameInfo.tablero,
            turno = GameInfo.turnoActual,
            juegoIniciado = GameInfo.juegoIniciado
        });

        Console.WriteLine($"✅ Reinicio completado");
    }
}
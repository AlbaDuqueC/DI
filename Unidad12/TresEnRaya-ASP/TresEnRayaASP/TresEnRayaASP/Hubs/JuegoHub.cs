using Microsoft.AspNetCore.SignalR;
using TresEnRayaASP.Entities;

namespace TresEnRayaASP.Hubs;

public class JuegoHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        try
        {
            GameInfo.numJugadores++;
            GameInfo.conexiones.Add(Context.ConnectionId);

            Console.WriteLine($"✅ Jugador conectado. Total: {GameInfo.numJugadores}");

            if (GameInfo.numJugadores == 1)
            {
                // Primer jugador - asignar X
                await Clients.Caller.SendAsync("EsperarOponente", new
                {
                    mensaje = "Esperando oponente...",
                    simbolo = "X"
                });

                await Clients.Caller.SendAsync("AsignarSimbolo", "X");

                Console.WriteLine("👤 Primer jugador (X) esperando");
            }
            else if (GameInfo.numJugadores == 2)
            {
                // Segundo jugador - iniciar juego
                GameInfo.StartGame();

                Console.WriteLine("🎮 Juego iniciado con 2 jugadores");

                // Asignar símbolos
                await Clients.Client(GameInfo.conexiones[0]).SendAsync("AsignarSimbolo", "X");
                await Clients.Client(GameInfo.conexiones[1]).SendAsync("AsignarSimbolo", "O");

                // Notificar inicio
                await Clients.All.SendAsync("JuegoIniciado", new
                {
                    mensaje = "¡El juego ha comenzado!",
                    tablero = GameInfo.tablero,
                    turno = GameInfo.turnoActual
                });
            }
            else
            {
                // Más de 2 jugadores
                GameInfo.numJugadores--;
                GameInfo.conexiones.Remove(Context.ConnectionId);
                await Clients.Caller.SendAsync("Error", "El juego ya está completo");
                Context.Abort();
            }

            await base.OnConnectedAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en OnConnectedAsync: {ex.Message}");
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            GameInfo.conexiones.Remove(Context.ConnectionId);
            GameInfo.numJugadores--;

            Console.WriteLine($"👋 Jugador desconectado. Total: {GameInfo.numJugadores}");

            if (GameInfo.numJugadores < 2 && GameInfo.juegoIniciado)
            {
                GameInfo.ReiniciarJuego();
                await Clients.All.SendAsync("JugadorDesconectado", "Un jugador se desconectó");
            }

            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en OnDisconnectedAsync: {ex.Message}");
        }
    }

    public async Task SendMove(Jugada jugada)
    {
        try
        {
            if (!GameInfo.juegoIniciado)
            {
                await Clients.Caller.SendAsync("Error", "El juego aún no ha iniciado");
                return;
            }

            if (GameInfo.juegoTerminado)
            {
                await Clients.Caller.SendAsync("Error", "El juego ya terminó");
                return;
            }

            int fila = jugada.movimiento[0];
            int columna = jugada.movimiento[1];

            Console.WriteLine($"📤 Movimiento recibido: [{fila}, {columna}]");

            // Validar posición
            if (fila < 0 || fila > 2 || columna < 0 || columna > 2)
            {
                await Clients.Caller.SendAsync("Error", "Posición inválida");
                return;
            }

            // Validar casilla vacía
            if (GameInfo.tablero[fila, columna] != null)
            {
                await Clients.Caller.SendAsync("Error", "Casilla ocupada");
                return;
            }

            // Determinar símbolo del jugador
            string simboloJugador = GameInfo.conexiones.IndexOf(Context.ConnectionId) == 0 ? "X" : "O";

            // Validar turno
            if (simboloJugador != GameInfo.turnoActual)
            {
                await Clients.Caller.SendAsync("Error", "No es tu turno");
                return;
            }

            // Realizar jugada
            GameInfo.Jugada(fila, columna);

            Console.WriteLine($"✅ Jugada: {simboloJugador} en [{fila}, {columna}]. Próximo turno: {GameInfo.turnoActual}");

            // Enviar actualización a todos
            await Clients.All.SendAsync("ActualizarTablero", new
            {
                tablero = GameInfo.tablero,
                turno = GameInfo.turnoActual,
                juegoTerminado = GameInfo.juegoTerminado,
                ganador = GameInfo.ganador
            });

            // Si el juego terminó
            if (GameInfo.juegoTerminado)
            {
                if (GameInfo.ganador == null)
                {
                    // Empate
                    await Clients.All.SendAsync("JuegoTerminado", new
                    {
                        resultado = "Empate",
                        mensaje = "¡Empate!"
                    });

                    Console.WriteLine("🤝 Juego terminado: EMPATE");
                }
                else
                {
                    // Hay ganador
                    await Clients.All.SendAsync("JuegoTerminado", new
                    {
                        resultado = GameInfo.ganador == simboloJugador ? "Victoria" : "Derrota",
                        mensaje = GameInfo.ganador == simboloJugador ? "¡Ganaste!" : "Perdiste",
                        ganador = GameInfo.ganador
                    });

                    Console.WriteLine($"🏆 Juego terminado: Ganador {GameInfo.ganador}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en SendMove: {ex.Message}");
            await Clients.Caller.SendAsync("Error", "Error al procesar el movimiento");
        }
    }
}
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

        bool debeConectar = false;
        bool esPrimerJugador = false;
        bool esSegundoJugador = false;
        bool partidaLlena = false;

        lock (GameInfo._lock)
        {
            // Limpiar conexiones vacías
            GameInfo.conexiones.RemoveAll(id => string.IsNullOrEmpty(id));

            Console.WriteLine($"📊 Jugadores ANTES de agregar: {GameInfo.conexiones.Count}");
            GameInfo.conexiones.ForEach(id => Console.WriteLine($"   - {id}"));

            // ⚠️ CRÍTICO: Verificar LÍMITE ANTES de agregar
            if (GameInfo.conexiones.Count >= 2)
            {
                Console.WriteLine($"❌ PARTIDA LLENA ({GameInfo.conexiones.Count}/2)");
                partidaLlena = true;
            }
            // Verificar duplicados
            else if (GameInfo.conexiones.Contains(connectionId))
            {
                Console.WriteLine($"⚠️ JUGADOR YA CONECTADO (duplicado detectado)");
                debeConectar = true;
                esPrimerJugador = false;
                esSegundoJugador = false;
            }
            else
            {
                // ✅ HAY ESPACIO - Agregar jugador
                GameInfo.conexiones.Add(connectionId);
                GameInfo.numJugadores = GameInfo.conexiones.Count;
                debeConectar = true;
                esPrimerJugador = GameInfo.conexiones.Count == 1;
                esSegundoJugador = GameInfo.conexiones.Count == 2;

                Console.WriteLine($"✅ JUGADOR AGREGADO EXITOSAMENTE");
                Console.WriteLine($"📊 Total jugadores DESPUÉS: {GameInfo.conexiones.Count}");
                Console.WriteLine($"🎯 Es primer jugador: {esPrimerJugador}");
                Console.WriteLine($"🎯 Es segundo jugador: {esSegundoJugador}");
            }
        }

        // ✅ Llamar a base SIEMPRE
        Console.WriteLine($"🔗 Llamando a base.OnConnectedAsync()...");
        await base.OnConnectedAsync();
        Console.WriteLine($"✅ base.OnConnectedAsync() completado");

        // Si la partida está llena, notificar y NO hacer nada más
        if (partidaLlena)
        {
            Console.WriteLine($"🚫 ENVIANDO EVENTO 'PartidaLlena' a {connectionId}");
            await Clients.Caller.SendAsync("PartidaLlena", new
            {
                mensaje = "La partida está llena (2/2 jugadores). Por favor espera."
            });
            Console.WriteLine($"📤 Evento 'PartidaLlena' enviado");
            Console.WriteLine($"═══════════════════════════════════════");
            return;
        }

        // Si no debe conectar (duplicado), no hacer nada
        if (!debeConectar)
        {
            Console.WriteLine($"⏭️ CONEXIÓN DUPLICADA - NO SE PROCESA");
            Console.WriteLine($"═══════════════════════════════════════");
            return;
        }

        // Enviar eventos según el tipo de jugador
        if (esPrimerJugador)
        {
            Console.WriteLine($"👤 PROCESANDO PRIMER JUGADOR (X)");
            Console.WriteLine($"📤 Enviando 'AsignarSimbolo' con X...");
            await Clients.Caller.SendAsync("AsignarSimbolo", "X");
            Console.WriteLine($"✅ 'AsignarSimbolo' enviado");

            Console.WriteLine($"📤 Enviando 'EsperarOponente'...");
            await Clients.Caller.SendAsync("EsperarOponente", new
            {
                simbolo = "X",
                mensaje = "Esperando al segundo jugador..."
            });
            Console.WriteLine($"✅ 'EsperarOponente' enviado");
        }
        else if (esSegundoJugador)
        {
            Console.WriteLine($"🎮 PROCESANDO SEGUNDO JUGADOR (O)");
            Console.WriteLine($"🎲 Iniciando juego...");

            lock (GameInfo._lock)
            {
                GameInfo.StartGame();
            }
            Console.WriteLine($"✅ GameInfo.StartGame() completado");

            Console.WriteLine($"📤 Enviando 'AsignarSimbolo' a AMBOS jugadores...");
            // Asignar símbolos a cada jugador
            await Clients.Client(GameInfo.conexiones[0]).SendAsync("AsignarSimbolo", "X");
            Console.WriteLine($"   ✅ X enviado a {GameInfo.conexiones[0]}");

            await Clients.Client(GameInfo.conexiones[1]).SendAsync("AsignarSimbolo", "O");
            Console.WriteLine($"   ✅ O enviado a {GameInfo.conexiones[1]}");

            Console.WriteLine($"📤 Enviando 'JuegoIniciado' a TODOS...");
            // Notificar inicio a TODOS
            await Clients.All.SendAsync("JuegoIniciado", new
            {
                tablero = GameInfo.tablero,
                turno = GameInfo.turnoActual,
                mensaje = "¡El juego ha comenzado!",
                jugadores = new
                {
                    jugador1 = "X",
                    jugador2 = "O"
                }
            });
            Console.WriteLine($"✅ 'JuegoIniciado' enviado a todos");
        }

        Console.WriteLine($"✅ OnConnectedAsync COMPLETADO EXITOSAMENTE");
        Console.WriteLine($"═══════════════════════════════════════");
        Console.WriteLine($"");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            string connectionId = Context.ConnectionId;

            Console.WriteLine($"");
            Console.WriteLine($"╔═══════════════════════════════════════╗");
            Console.WriteLine($"║  DESCONEXIÓN DETECTADA                ║");
            Console.WriteLine($"╚═══════════════════════════════════════╝");
            Console.WriteLine($"🆔 Connection ID: {connectionId}");
            if (exception != null)
            {
                Console.WriteLine($"⚠️ Excepción: {exception.Message}");
            }

            bool eraJugadorActivo = false;
            int jugadoresRestantes = 0;

            lock (GameInfo._lock)
            {
                Console.WriteLine($"📊 Jugadores ANTES de remover: {GameInfo.conexiones.Count}");

                if (GameInfo.conexiones.Contains(connectionId))
                {
                    eraJugadorActivo = true;
                    GameInfo.conexiones.Remove(connectionId);
                    GameInfo.numJugadores = GameInfo.conexiones.Count;
                    jugadoresRestantes = GameInfo.conexiones.Count;

                    Console.WriteLine($"✅ Jugador removido exitosamente");
                    Console.WriteLine($"📊 Jugadores restantes: {jugadoresRestantes}");

                    // Resetear solo si el juego estaba activo
                    if (GameInfo.juegoIniciado)
                    {
                        // Resetear pero mantener las conexiones existentes
                        GameInfo.tablero = new string[3, 3];
                        GameInfo.turnoActual = "X";
                        GameInfo.juegoIniciado = false;
                        GameInfo.juegoTerminado = false;
                        GameInfo.ganador = null;

                        Console.WriteLine($"🔄 Juego reiniciado (oponente desconectado)");
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️ Jugador NO estaba en la lista de conexiones");
                }
            }

            if (eraJugadorActivo && jugadoresRestantes > 0)
            {
                Console.WriteLine($"📤 Notificando desconexión a jugadores restantes...");
                await Clients.All.SendAsync("JugadorDesconectado", new
                {
                    mensaje = "Tu oponente se ha desconectado.",
                    jugadoresConectados = jugadoresRestantes
                });

                // Si queda 1 jugador, ponerlo en espera
                await Clients.All.SendAsync("EsperarOponente", new
                {
                    simbolo = "X",
                    mensaje = "Esperando nuevo oponente..."
                });
                Console.WriteLine($"✅ Notificaciones enviadas");
            }

            Console.WriteLine($"✅ OnDisconnectedAsync COMPLETADO");
            Console.WriteLine($"═══════════════════════════════════════");
            Console.WriteLine($"");

            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ ERROR CRÍTICO en OnDisconnected: {ex.Message}");
            Console.WriteLine($"Stack: {ex.StackTrace}");
        }
    }

    public async Task SendMove(Jugada jugada)
    {
        try
        {
            Console.WriteLine($"🎯 SendMove recibido de: {Context.ConnectionId}");

            // Validación inicial
            if (jugada?.movimiento == null || jugada.movimiento.Length != 2)
            {
                await Clients.Caller.SendAsync("Error", "Movimiento inválido");
                return;
            }

            int fila = jugada.movimiento[0];
            int columna = jugada.movimiento[1];

            Console.WriteLine($"   Movimiento: [{fila}, {columna}]");

            // Validar rango
            if (fila < 0 || fila > 2 || columna < 0 || columna > 2)
            {
                await Clients.Caller.SendAsync("Error", "Posición fuera de rango");
                return;
            }

            string simboloJugador = "";
            bool movimientoValido = false;
            bool juegoTerminadoDespuesMovimiento = false;
            string? ganadorFinal = null;
            string? mensajeError = null;

            lock (GameInfo._lock)
            {
                // Validar estado del juego
                if (!GameInfo.juegoIniciado)
                {
                    Console.WriteLine($"⚠️ Movimiento rechazado - juego no iniciado");
                    mensajeError = "El juego no ha iniciado";
                }
                else if (GameInfo.juegoTerminado)
                {
                    Console.WriteLine($"⚠️ Movimiento rechazado - juego terminado");
                    mensajeError = "El juego ya terminó";
                }
                else
                {
                    // Validar jugador
                    int indice = GameInfo.conexiones.IndexOf(Context.ConnectionId);
                    if (indice == -1)
                    {
                        Console.WriteLine($"⚠️ Jugador no encontrado en la partida");
                        mensajeError = "No estás en esta partida";
                    }
                    else
                    {
                        simboloJugador = (indice == 0) ? "X" : "O";

                        // Validar turno
                        if (simboloJugador != GameInfo.turnoActual)
                        {
                            Console.WriteLine($"⚠️ No es el turno de {simboloJugador} (turno: {GameInfo.turnoActual})");
                            mensajeError = $"No es tu turno. Turno actual: {GameInfo.turnoActual}";
                        }
                        // Validar casilla vacía
                        else if (GameInfo.tablero[fila, columna] != null)
                        {
                            Console.WriteLine($"⚠️ Casilla ocupada: [{fila}, {columna}] = {GameInfo.tablero[fila, columna]}");
                            mensajeError = "Casilla ocupada";
                        }
                        else
                        {
                            // ✅ MOVIMIENTO VÁLIDO
                            movimientoValido = true;
                            Console.WriteLine($"✅ Movimiento válido de {simboloJugador}: [{fila}, {columna}]");

                            GameInfo.Jugada(fila, columna);

                            juegoTerminadoDespuesMovimiento = GameInfo.juegoTerminado;
                            ganadorFinal = GameInfo.ganador;
                        }
                    }
                }
            }

            // Enviar errores FUERA del lock
            if (mensajeError != null)
            {
                await Clients.Caller.SendAsync("Error", mensajeError);
                return;
            }

            if (!movimientoValido)
            {
                return;
            }

            // Notificar a todos FUERA del lock
            await Clients.All.SendAsync("ActualizarTablero", new
            {
                tablero = GameInfo.tablero,
                turno = GameInfo.turnoActual,
                juegoTerminado = juegoTerminadoDespuesMovimiento,
                ganador = ganadorFinal,
                ultimoMovimiento = new { fila, columna, simbolo = simboloJugador }
            });

            if (juegoTerminadoDespuesMovimiento)
            {
                string mensajeFinal = ganadorFinal == null
                    ? "¡Empate! Nadie ganó esta vez."
                    : $"¡Ganó {ganadorFinal}!";

                Console.WriteLine($"🏁 Juego terminado: {mensajeFinal}");

                await Clients.All.SendAsync("JuegoTerminado", new
                {
                    mensaje = mensajeFinal,
                    ganador = ganadorFinal,
                    tablero = GameInfo.tablero
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en SendMove: {ex.Message}");
            Console.WriteLine($"Stack: {ex.StackTrace}");
            await Clients.Caller.SendAsync("Error", "Error procesando movimiento");
        }
    }

    public async Task ReiniciarJuego()
    {
        try
        {
            Console.WriteLine($"🔄 Reinicio manual solicitado por: {Context.ConnectionId}");

            int jugadoresActivos = 0;

            lock (GameInfo._lock)
            {
                jugadoresActivos = GameInfo.conexiones.Count;

                // Solo reiniciar el tablero, mantener conexiones
                GameInfo.tablero = new string[3, 3];
                GameInfo.turnoActual = "X";
                GameInfo.juegoTerminado = false;
                GameInfo.ganador = null;

                // Solo marcar como iniciado si hay 2 jugadores
                GameInfo.juegoIniciado = jugadoresActivos == 2;
            }

            if (jugadoresActivos == 2)
            {
                await Clients.All.SendAsync("JuegoReiniciado", new
                {
                    mensaje = "El juego se ha reiniciado",
                    tablero = GameInfo.tablero,
                    turno = GameInfo.turnoActual,
                    juegoIniciado = true
                });

                Console.WriteLine($"✅ Juego reiniciado correctamente (2 jugadores)");
            }
            else
            {
                await Clients.All.SendAsync("JuegoReiniciado", new
                {
                    mensaje = "Esperando más jugadores para iniciar",
                    tablero = GameInfo.tablero,
                    turno = GameInfo.turnoActual,
                    juegoIniciado = false
                });

                Console.WriteLine($"⏳ Esperando jugadores ({jugadoresActivos}/2)");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en ReiniciarJuego: {ex.Message}");
        }
    }

    public async Task ObtenerEstadoJuego()
    {
        await Clients.Caller.SendAsync("EstadoJuego", new
        {
            jugadores = GameInfo.numJugadores,
            tablero = GameInfo.tablero,
            turno = GameInfo.turnoActual,
            iniciado = GameInfo.juegoIniciado,
            terminado = GameInfo.juegoTerminado,
            ganador = GameInfo.ganador,
            conexionId = Context.ConnectionId
        });
    }
}
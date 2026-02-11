using System;
using System.Collections.Generic;

namespace TresEnRayaASP.Entities;

public static class GameInfo
{
    // Objeto de bloqueo centralizado para sincronizar todos los hilos
    public static readonly object _lock = new object();

    public static int numJugadores = 0;

    // Cambiado a array escalonado para compatibilidad con la serialización JSON de SignalR
    public static string[][] tablero = CrearTableroVacio();

    public static List<string> conexiones = new List<string>();

    public static string turnoActual = "X";
    public static bool juegoIniciado = false;
    public static bool juegoTerminado = false;
    public static string? ganador = null;

    // Método auxiliar para no repetir código de creación de tablero
    private static string[][] CrearTableroVacio()
    {
        return new string[3][]
        {
            new string[3],
            new string[3],
            new string[3]
        };
    }

    public static void Jugada(int fila, int columna)
    {
        lock (_lock)
        {
            // Cambiado acceso de [fila, columna] a [fila][columna]
            if (!juegoTerminado && tablero[fila][columna] == null)
            {
                tablero[fila][columna] = turnoActual;

                if (VerificarGanadorInterno(turnoActual))
                {
                    ganador = turnoActual;
                    juegoTerminado = true;
                }
                else if (TableroLlenoInterno())
                {
                    juegoTerminado = true;
                    ganador = null; // Empate
                }
                else
                {
                    turnoActual = turnoActual == "X" ? "O" : "X";
                }
            }
        }
    }

    public static void StartGame()
    {
        lock (_lock)
        {
            tablero = CrearTableroVacio(); // Corregido: ya no usa [3,3]
            turnoActual = "X";
            juegoIniciado = true;
            juegoTerminado = false;
            ganador = null;
            Console.WriteLine("🎮 Juego Iniciado y estado de tablero limpiado");
        }
    }

    public static void ReiniciarJuego()
    {
        lock (_lock)
        {
            numJugadores = 0;
            tablero = CrearTableroVacio(); // Corregido: ya no usa [3,3]
            conexiones.Clear();
            turnoActual = "X";
            juegoIniciado = false;
            juegoTerminado = false;
            ganador = null;
            Console.WriteLine("🔄 Estado Reiniciado por completo");
        }
    }

    private static bool VerificarGanadorInterno(string simbolo)
    {
        // Filas y Columnas - Cambiado acceso a [i][j]
        for (int i = 0; i < 3; i++)
        {
            if (tablero[i][0] == simbolo && tablero[i][1] == simbolo && tablero[i][2] == simbolo) return true;
            if (tablero[0][i] == simbolo && tablero[1][i] == simbolo && tablero[2][i] == simbolo) return true;
        }

        // Diagonales - Cambiado acceso a [i][j]
        if (tablero[0][0] == simbolo && tablero[1][1] == simbolo && tablero[2][2] == simbolo) return true;
        if (tablero[0][2] == simbolo && tablero[1][1] == simbolo && tablero[2][0] == simbolo) return true;

        return false;
    }

    private static bool TableroLlenoInterno()
    {
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                if (tablero[i][j] == null) return false;
        return true;
    }
}
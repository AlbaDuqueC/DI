namespace TresEnRayaASP.Entities;

public static class GameInfo
{
    public static int numJugadores = 0;
    public static string[,] tablero = new string[3, 3];
    public static List<string> conexiones = new List<string>(); // ⬅️ AÑADIR ESTO
    public static string turnoActual = "X";
    public static bool juegoIniciado = false;
    public static bool juegoTerminado = false;
    public static string? ganador = null;

    public static void Jugada(int fila, int columna)
    {
        if (tablero[fila, columna] == null)
        {
            tablero[fila, columna] = turnoActual;

            if (VerificarGanador(turnoActual))
            {
                ganador = turnoActual;
                juegoTerminado = true;
            }
            else if (TableroLleno())
            {
                juegoTerminado = true;
                ganador = null;
            }
            else
            {
                turnoActual = turnoActual == "X" ? "O" : "X";
            }
        }
    }

    public static void StartGame()
    {
        tablero = new string[3, 3];
        turnoActual = "X";
        juegoIniciado = true;
        juegoTerminado = false;
        ganador = null;
    }

    public static void ReiniciarJuego()
    {
        numJugadores = 0;
        tablero = new string[3, 3];
        conexiones.Clear();
        turnoActual = "X";
        juegoIniciado = false;
        juegoTerminado = false;
        ganador = null;
    }

    private static bool VerificarGanador(string simbolo)
    {
        // Verificar filas
        for (int i = 0; i < 3; i++)
            if (tablero[i, 0] == simbolo && tablero[i, 1] == simbolo && tablero[i, 2] == simbolo)
                return true;

        // Verificar columnas
        for (int i = 0; i < 3; i++)
            if (tablero[0, i] == simbolo && tablero[1, i] == simbolo && tablero[2, i] == simbolo)
                return true;

        // Verificar diagonales
        if (tablero[0, 0] == simbolo && tablero[1, 1] == simbolo && tablero[2, 2] == simbolo)
            return true;

        if (tablero[0, 2] == simbolo && tablero[1, 1] == simbolo && tablero[2, 0] == simbolo)
            return true;

        return false;
    }

    private static bool TableroLleno()
    {
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                if (tablero[i, j] == null)
                    return false;
        return true;
    }
}
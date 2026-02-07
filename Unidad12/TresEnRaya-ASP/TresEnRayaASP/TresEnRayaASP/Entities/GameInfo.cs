namespace TresEnRayaASP.Entities;

public static class GameInfo
{
    public static int numJugadores = 0;
    public static string[,] tablero = new string[3, 3];
    public static string turnoActual = "X";
    public static string? ganador = null;

    public static void Jugada(int fila, int columna)
    {
        if (tablero[fila, columna] == null)
        {
            tablero[fila, columna] = turnoActual;

            if (VerificarGanador(turnoActual))
            {
                ganador = turnoActual;
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
        ganador = null;
    }

    private static bool VerificarGanador(string simbolo)
    {
        // Filas
        for (int i = 0; i < 3; i++)
            if (tablero[i, 0] == simbolo && tablero[i, 1] == simbolo && tablero[i, 2] == simbolo)
                return true;

        // Columnas
        for (int i = 0; i < 3; i++)
            if (tablero[0, i] == simbolo && tablero[1, i] == simbolo && tablero[2, i] == simbolo)
                return true;

        // Diagonales
        if (tablero[0, 0] == simbolo && tablero[1, 1] == simbolo && tablero[2, 2] == simbolo)
            return true;

        if (tablero[0, 2] == simbolo && tablero[1, 1] == simbolo && tablero[2, 0] == simbolo)
            return true;

        return false;
    }
}
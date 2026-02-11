namespace TresEnRayaASP.Entities;

    public class Jugada
    {
        public int[] movimiento { get; set; }
        public string simbolo { get; set; }

        public Jugada(int[] movimiento, string simbolo)
        {
            this.movimiento = movimiento;
            this.simbolo = simbolo;
        }
    }


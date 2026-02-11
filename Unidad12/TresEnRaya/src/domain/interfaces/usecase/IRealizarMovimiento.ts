export interface IRealizarMovimiento {
  ejecutar(idJuego: number, idJugador: number, fila: number, columna: number): void;
}
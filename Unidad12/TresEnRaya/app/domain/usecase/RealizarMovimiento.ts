import { IRealizarMovimiento } from '../interfaces/usecase/IRealizarMovimiento';
import { IRepositorioJuego } from '../interfaces/repositories/IRepositorioJuego';

export class RealizarMovimiento implements IRealizarMovimiento {
  constructor(private repositorio: IRepositorioJuego) {}

  ejecutar(idJuego: number, idJugador: number, fila: number, columna: number): void {
    this.repositorio.realizarMovimiento(idJuego, idJugador, fila, columna);
  }
}
import { Juego } from '../entities/Juego';
import { IUnirseJuego } from '../interfaces/usecase/IUnirseJuego';
import { IRepositorioJuego } from '../interfaces/repositories/IRepositorioJuego';

export class UnirseJuego implements IUnirseJuego {
  constructor(private repositorio: IRepositorioJuego) {}

  ejecutar(idJuego: number, idJugador: number): Juego {
    return this.repositorio.unirseJuego(idJuego, idJugador);
  }
}
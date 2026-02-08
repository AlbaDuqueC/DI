import { Juego } from '../entities/Juego';
import { ICrearJuego } from '../interfaces/usecase/ICrearJuego';
import { IRepositorioJuego } from '../interfaces/repositories/IRepositorioJuego';

export class CrearJuego implements ICrearJuego {
  constructor(private repositorio: IRepositorioJuego) {}

  ejecutar(idJugador: number): Juego {
    return this.repositorio.crearJuego(idJugador);
  }
}
import { Juego } from '../../domain/entities/Juego';
import { ICrearJuego } from '../../domain/interfaces/usecase/ICrearJuego';
import { IUnirseJuego } from '../../domain/interfaces/usecase/IUnirseJuego';
import { IRealizarMovimiento } from '../../domain/interfaces/usecase/IRealizarMovimiento';
import { IRepositorioJuego } from '../../domain/interfaces/repositories/IRepositorioJuego';

export class JuegoViewModel {
  constructor(
    private crearJuego: ICrearJuego,
    private unirseJuego: IUnirseJuego,
    private realizarMovimiento: IRealizarMovimiento,
    private repositorio: IRepositorioJuego
  ) {}

  crearJuegoNuevo(idJugador: number): Juego {
    return this.crearJuego.ejecutar(idJugador);
  }

  unirseAJuego(idJuego: number, idJugador: number): Juego {
    return this.unirseJuego.ejecutar(idJuego, idJugador);
  }

  hacerMovimiento(idJuego: number, idJugador: number, fila: number, columna: number): void {
    this.realizarMovimiento.ejecutar(idJuego, idJugador, fila, columna);
  }

  obtenerJuego(idJuego: number): Juego {
    return this.repositorio.obtenerJuego(idJuego);
  }
}
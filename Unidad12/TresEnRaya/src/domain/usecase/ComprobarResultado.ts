import { ResultadoJuego, EstadoJuego } from '../../core/Type';
import { Juego } from '../entities/Juego';
import { IComprobarResultado } from '../interfaces/usecase/IComprobarResultado';

export class ComprobarResultado implements IComprobarResultado {
  ejecutar(juego: Juego, idJugador: number): ResultadoJuego {
    if (juego.estado !== EstadoJuego.Finalizado) {
      return ResultadoJuego.EnJuego;
    }

    if (juego.ganador === null) {
      return ResultadoJuego.Empate;
    }

    return juego.ganador.id === idJugador ? ResultadoJuego.Victoria : ResultadoJuego.Derrota;
  }
}
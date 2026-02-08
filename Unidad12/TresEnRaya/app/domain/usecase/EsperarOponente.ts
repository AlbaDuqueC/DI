import { EstadoJuego } from '../../core/Type';
import { Juego } from '../entities/Juego';
import { IEsperarOponente } from '../interfaces/usecase/IEsperarOponente';

export class EsperarOponente implements IEsperarOponente {
  ejecutar(juego: Juego): boolean {
    return juego.estado === EstadoJuego.EsperandoJugadores || juego.jugadores.length < 2;
  }
}
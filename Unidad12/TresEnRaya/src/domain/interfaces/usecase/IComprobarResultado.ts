import { ResultadoJuego } from '../../../core/Type';
import { Juego } from '../../entities/Juego';

export interface IComprobarResultado {
  ejecutar(juego: Juego, idJugador: number): ResultadoJuego;
}
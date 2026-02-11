import { Juego } from '../../entities/Juego';

export interface ICrearJuego {
  ejecutar(idJugador: number): Juego;
}
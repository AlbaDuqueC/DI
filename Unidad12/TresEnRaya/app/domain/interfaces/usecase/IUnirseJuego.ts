import { Juego } from '../../entities/Juego';

export interface IUnirseJuego {
  ejecutar(idJuego: number, idJugador: number): Juego;
}
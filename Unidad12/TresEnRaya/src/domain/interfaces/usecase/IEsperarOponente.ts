import { Juego } from '../../entities/Juego';

export interface IEsperarOponente {
  ejecutar(juego: Juego): boolean;
}
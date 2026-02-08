import { Juego } from '../../entities/Juego';

export interface IRepositorioJuego {
  crearJuego(idJugador: number): Juego;
  unirseJuego(idJuego: number, idJugador: number): Juego;
  realizarMovimiento(idJuego: number, idJugador: number, fila: number, columna: number): void;
  obtenerJuego(idJuego: number): Juego;
  actualizarDesdeServidor(tablero: any, ganador: string | null): void;
  establecerMiSimbolo(simbolo: string): void;
  actualizarTurno(turnoActual: string): void;
  obtenerMiIdJugador(): number | null;
}
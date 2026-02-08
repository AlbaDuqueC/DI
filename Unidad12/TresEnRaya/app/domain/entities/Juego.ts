import { SimboloJugador, EstadoJuego } from '../../core/Type';
import { Jugador } from './Jugador';

export class Juego {
  private _id: number;
  private _tablero: (SimboloJugador | null)[][];
  private _jugadores: Jugador[];
  private _estado: EstadoJuego;
  private _ganador: Jugador | null;

  constructor(id: number) {
    this._id = id;
    this._tablero = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    this._jugadores = [];
    this._estado = EstadoJuego.EsperandoJugadores;
    this._ganador = null;
  }

  get id(): number {
    return this._id;
  }

  get tablero(): (SimboloJugador | null)[][] {
    return this._tablero;
  }

  set tablero(value: (SimboloJugador | null)[][]) {
    this._tablero = value;
  }

  get jugadores(): Jugador[] {
    return this._jugadores;
  }

  get estado(): EstadoJuego {
    return this._estado;
  }

  set estado(value: EstadoJuego) {
    this._estado = value;
  }

  get ganador(): Jugador | null {
    return this._ganador;
  }

  cambiarTurno(): void {
    this._jugadores.forEach(jugador => {
      jugador.esTurno = !jugador.esTurno;
    });
  }

  establecerGanador(jugador: Jugador): void {
    this._ganador = jugador;
    this._estado = EstadoJuego.Finalizado;
  }
}
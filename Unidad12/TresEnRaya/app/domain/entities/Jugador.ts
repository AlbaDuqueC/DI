import { SimboloJugador } from '../../core/Type';

export class Jugador {
  private _id: number;
  private _simbolo: SimboloJugador;
  private _esTurno: boolean;

  constructor(id: number, simbolo: SimboloJugador, esTurno: boolean = false) {
    this._id = id;
    this._simbolo = simbolo;
    this._esTurno = esTurno;
  }

  get id(): number {
    return this._id;
  }

  get simbolo(): SimboloJugador {
    return this._simbolo;
  }

  set simbolo(value: SimboloJugador) {
    this._simbolo = value;
  }

  get esTurno(): boolean {
    return this._esTurno;
  }

  set esTurno(value: boolean) {
    this._esTurno = value;
  }
}
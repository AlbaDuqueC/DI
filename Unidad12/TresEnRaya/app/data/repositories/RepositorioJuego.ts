import { Juego } from '../../domain/entities/Juego';
import { Jugador } from '../../domain/entities/Jugador';
import { SimboloJugador, EstadoJuego } from '../../core/Type';
import { IRepositorioJuego } from '../../domain/interfaces/repositories/IRepositorioJuego';
import { ContextoSignalR } from '../datasource/ContextoSignalR';

export class RepositorioJuego implements IRepositorioJuego {
  private juego: Juego | null = null;
  private contexto: ContextoSignalR;
  private miIdJugador: number | null = null;

  constructor(contexto: ContextoSignalR) {
    this.contexto = contexto;
  }

  crearJuego(idJugador: number): Juego {
    this.juego = new Juego(1);
    const jugador = new Jugador(idJugador, SimboloJugador.X, true);
    this.juego.jugadores.push(jugador);
    this.miIdJugador = idJugador;
    
    return this.juego;
  }

  unirseJuego(idJuego: number, idJugador: number): Juego {
    if (!this.juego) {
      this.juego = new Juego(1);
    }
    
    if (this.juego.jugadores.length >= 2) {
      throw new Error('El juego está completo');
    }

    const jugador = new Jugador(idJugador, SimboloJugador.O, false);
    this.juego.jugadores.push(jugador);
    this.juego.estado = EstadoJuego.EnCurso;
    this.miIdJugador = idJugador;

    return this.juego;
  }

  realizarMovimiento(idJuego: number, idJugador: number, fila: number, columna: number): void {
    if (!this.juego) {
      throw new Error('No hay juego activo');
    }

    const jugador = this.juego.jugadores.find(j => j.id === idJugador);

    if (!jugador) {
      throw new Error('No eres parte de este juego');
    }

    if (!jugador.esTurno) {
      throw new Error('No es tu turno');
    }

    if (this.juego.tablero[fila][columna] !== null) {
      throw new Error('Casilla ocupada');
    }

    // IMPORTANTE: Actualizar el tablero directamente
    this.juego.tablero[fila][columna] = jugador.simbolo;

    // Verificar ganador
    if (this.verificarGanador(this.juego, jugador.simbolo)) {
      this.juego.establecerGanador(jugador);
    } else if (this.tableroLleno(this.juego)) {
      this.juego.estado = EstadoJuego.Finalizado;
    } else {
      this.juego.cambiarTurno();
    }

    // Enviar al servidor Azure
    this.contexto.enviarMovimiento(fila, columna);
  }

  obtenerJuego(idJuego: number): Juego {
    if (!this.juego) {
      throw new Error('No hay juego activo');
    }
    return this.juego;
  }

  actualizarDesdeServidor(tablero: any, ganador: string | null): void {
    if (!this.juego) return;

    console.log('Actualizando desde servidor:', tablero);

    // Actualizar tablero desde servidor
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tablero[i] && tablero[i][j] !== undefined) {
          const valor = tablero[i][j];
          if (valor === 'X') {
            this.juego.tablero[i][j] = SimboloJugador.X;
          } else if (valor === 'O') {
            this.juego.tablero[i][j] = SimboloJugador.O;
          } else {
            this.juego.tablero[i][j] = null;
          }
        }
      }
    }

    // Actualizar ganador
    if (ganador) {
      const jugadorGanador = this.juego.jugadores.find(
        j => j.simbolo.toString() === ganador
      );
      if (jugadorGanador) {
        this.juego.establecerGanador(jugadorGanador);
      }
    }
  }

  establecerMiSimbolo(simbolo: string): void {
    if (!this.juego || !this.miIdJugador) {
      // Si no hay juego, crear el jugador
      if (!this.juego) {
        this.juego = new Juego(1);
      }
      
      const simboloEnum = simbolo === 'X' ? SimboloJugador.X : SimboloJugador.O;
      const esTurno = simbolo === 'X'; // X siempre empieza
      
      // Buscar si ya existe el jugador
      let jugador = this.juego.jugadores.find(j => j.simbolo === simboloEnum);
      
      if (!jugador) {
        // Crear nuevo jugador
        const nuevoId = Date.now();
        jugador = new Jugador(nuevoId, simboloEnum, esTurno);
        this.juego.jugadores.push(jugador);
        this.miIdJugador = nuevoId;
      }
      
      return;
    }

    const jugador = this.juego.jugadores.find(j => j.id === this.miIdJugador);
    if (jugador) {
      jugador.simbolo = simbolo === 'X' ? SimboloJugador.X : SimboloJugador.O;
      jugador.esTurno = simbolo === 'X'; // X siempre empieza
    }
  }

  actualizarTurno(turnoActual: string): void {
    if (!this.juego) return;

    console.log('Actualizando turno:', turnoActual);

    this.juego.jugadores.forEach(jugador => {
      jugador.esTurno = jugador.simbolo.toString() === turnoActual;
    });
  }

  obtenerMiIdJugador(): number | null {
    return this.miIdJugador;
  }

  private verificarGanador(juego: Juego, simbolo: SimboloJugador): boolean {
    // Filas
    for (let i = 0; i < 3; i++) {
      if (juego.tablero[i][0] === simbolo && 
          juego.tablero[i][1] === simbolo && 
          juego.tablero[i][2] === simbolo) {
        return true;
      }
    }

    // Columnas
    for (let i = 0; i < 3; i++) {
      if (juego.tablero[0][i] === simbolo && 
          juego.tablero[1][i] === simbolo && 
          juego.tablero[2][i] === simbolo) {
        return true;
      }
    }

    // Diagonales
    if (juego.tablero[0][0] === simbolo && 
        juego.tablero[1][1] === simbolo && 
        juego.tablero[2][2] === simbolo) {
      return true;
    }

    if (juego.tablero[0][2] === simbolo && 
        juego.tablero[1][1] === simbolo && 
        juego.tablero[2][0] === simbolo) {
      return true;
    }

    return false;
  }

  private tableroLleno(juego: Juego): boolean {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (juego.tablero[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }
}
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
    
    console.log('🎮 Juego creado:', { idJugador, simbolo: 'X' });
    
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

    console.log('🎮 Jugador unido:', { idJugador, simbolo: 'O' });

    return this.juego;
  }

  realizarMovimiento(idJuego: number, idJugador: number, fila: number, columna: number): void {
    if (!this.juego) {
      throw new Error('No hay juego activo');
    }

    const jugador = this.juego.jugadores.find(j => j.id === idJugador);

    if (!jugador) {
      console.error('❌ Jugador no encontrado:', { idJugador, jugadoresEnJuego: this.juego.jugadores.map(j => j.id) });
      throw new Error('No eres parte de este juego');
    }

    console.log('🎲 Verificando movimiento:', {
      idJugador,
      simbolo: jugador.simbolo,
      esTurno: jugador.esTurno,
      fila,
      columna,
      casillaActual: this.juego.tablero[fila][columna]
    });

    if (!jugador.esTurno) {
      console.error('❌ No es el turno del jugador');
      throw new Error('No es tu turno');
    }

    if (this.juego.tablero[fila][columna] !== null) {
      console.error('❌ Casilla ocupada');
      throw new Error('Casilla ocupada');
    }

    // IMPORTANTE: Actualizar el tablero directamente
    this.juego.tablero[fila][columna] = jugador.simbolo;

    console.log('✅ Movimiento realizado:', { fila, columna, simbolo: jugador.simbolo });

    // Verificar ganador
    if (this.verificarGanador(this.juego, jugador.simbolo)) {
      this.juego.establecerGanador(jugador);
      console.log('🏆 ¡Ganador!:', jugador.simbolo);
    } else if (this.tableroLleno(this.juego)) {
      this.juego.estado = EstadoJuego.Finalizado;
      console.log('🤝 Empate');
    } else {
      this.juego.cambiarTurno();
      console.log('🔄 Turno cambiado localmente');
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

    console.log('📥 Actualizando desde servidor:', { tablero, ganador });

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
        console.log('🏆 Ganador establecido:', ganador);
      } else {
        console.log('⚠️ Ganador no encontrado en jugadores, estableciendo estado finalizado');
        this.juego.estado = EstadoJuego.Finalizado;
      }
    } else if (this.tableroLleno(this.juego)) {
      // Si no hay ganador pero el tablero está lleno, es empate
      console.log('🤝 Empate detectado');
      this.juego.estado = EstadoJuego.Finalizado;
    }
  }

  establecerMiSimbolo(simbolo: string): void {
    if (!this.juego) {
      this.juego = new Juego(1);
    }
    
    const simboloEnum = simbolo === 'X' ? SimboloJugador.X : SimboloJugador.O;
    const esTurno = simbolo === 'X'; // X siempre empieza
    
    // Buscar si ya existe mi jugador
    let miJugador = this.juego.jugadores.find(j => j.simbolo === simboloEnum);
    
    if (!miJugador) {
      // Crear mi jugador
      const nuevoId = Date.now();
      miJugador = new Jugador(nuevoId, simboloEnum, esTurno);
      this.juego.jugadores.push(miJugador);
      this.miIdJugador = nuevoId;
      console.log('👤 Mi jugador creado:', { id: nuevoId, simbolo, esTurno });
    } else {
      this.miIdJugador = miJugador.id;
    }
    
    // ✅ CREAR EL JUGADOR OPONENTE si no existe
    const simboloOponente = simbolo === 'X' ? SimboloJugador.O : SimboloJugador.X;
    const existeOponente = this.juego.jugadores.find(j => j.simbolo === simboloOponente);
    
    if (!existeOponente) {
      const idOponente = Date.now() + 1;
      const esTurnoOponente = simbolo === 'O'; // Si yo soy O, X empieza
      const oponente = new Jugador(idOponente, simboloOponente, esTurnoOponente);
      this.juego.jugadores.push(oponente);
      console.log('👤 Oponente creado:', { 
        id: idOponente, 
        simbolo: simboloOponente === SimboloJugador.X ? 'X' : 'O', 
        esTurno: esTurnoOponente 
      });
    }
  }

  actualizarTurno(turnoActual: string): void {
    if (!this.juego) return;

    console.log('🔄 ===== ACTUALIZAR TURNO =====');
    console.log('Turno recibido del servidor:', turnoActual);
    console.log('Jugadores ANTES de actualizar:');
    this.juego.jugadores.forEach(j => {
      console.log(`  - Símbolo: ${j.simbolo}, esTurno: ${j.esTurno}`);
    });

    this.juego.jugadores.forEach(jugador => {
      const simboloStr = jugador.simbolo.toString();
      const nuevoTurno = simboloStr === turnoActual;
      
      console.log(`  Cambio: ${simboloStr} de ${jugador.esTurno} -> ${nuevoTurno}`);
      
      jugador.esTurno = nuevoTurno;
    });

    console.log('Jugadores DESPUÉS de actualizar:');
    this.juego.jugadores.forEach(j => {
      console.log(`  - Símbolo: ${j.simbolo}, esTurno: ${j.esTurno}`);
    });
    console.log('🔄 ===== FIN ACTUALIZAR TURNO =====');
  }

  reiniciarEstadoLocal(): void {
    if (!this.juego) return;
    
    console.log('🔄 Reiniciando estado local');
    
    // Reiniciar tablero
    this.juego.tablero = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    
    // Reiniciar estado
    this.juego.estado = EstadoJuego.EnCurso;
    
    // Limpiar ganador (acceso privado mediante casting)
    (this.juego as any)._ganador = null;
    
    // X siempre empieza
    this.juego.jugadores.forEach(j => {
      j.esTurno = j.simbolo === SimboloJugador.X;
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
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

    console.log('📥 ==========================================');
    console.log('📥 ACTUALIZAR DESDE SERVIDOR');
    console.log('📥 Datos recibidos:', { 
      tablero, 
      ganador,
      tipoGanador: typeof ganador,
      ganadorJSON: JSON.stringify(ganador)
    });

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

    console.log('📋 Tablero actualizado:', this.juego.tablero);

    // Actualizar ganador - SÚPER ROBUSTO
    if (ganador !== null && ganador !== undefined && ganador !== '') {
      console.log('🎯 HAY GANADOR - Procesando...');
      
      // Intentar extraer el símbolo de diferentes formas
      let ganadorStr: string;
      
      if (typeof ganador === 'object' && ganador !== null) {
        // Si es un objeto, intentar extraer la propiedad 'simbolo'
        ganadorStr = String((ganador as any).simbolo || ganador).trim().toUpperCase();
        console.log('🔍 Ganador es objeto, extraído:', ganadorStr);
      } else {
        // Si es string/número/otro
        ganadorStr = String(ganador).trim().toUpperCase();
        console.log('🔍 Ganador normalizado:', ganadorStr);
      }
      
      console.log('👥 Jugadores en el juego:');
      this.juego.jugadores.forEach((j, idx) => {
        console.log(`   [${idx}] ID: ${j.id}, Símbolo: "${j.simbolo}" (tipo: ${typeof j.simbolo}), Valor toString: "${String(j.simbolo)}"`);
      });
      
      // Buscar el jugador ganador - MÚLTIPLES INTENTOS
      let jugadorGanador: Jugador | undefined;
      
      // Intento 1: Comparación con toString()
      jugadorGanador = this.juego.jugadores.find(j => {
        const simboloStr = String(j.simbolo).trim().toUpperCase();
        const match = simboloStr === ganadorStr;
        console.log(`   Intento 1: "${simboloStr}" === "${ganadorStr}" = ${match}`);
        return match;
      });
      
      // Intento 2: Si no se encontró, comparación directa con el enum
      if (!jugadorGanador) {
        console.log('⚠️ Intento 1 falló, probando intento 2...');
        const simboloGanador = ganadorStr === 'X' ? SimboloJugador.X : SimboloJugador.O;
        jugadorGanador = this.juego.jugadores.find(j => {
          const match = j.simbolo === simboloGanador;
          console.log(`   Intento 2: ${j.simbolo} === ${simboloGanador} = ${match}`);
          return match;
        });
      }
      
      // Intento 3: Si aún no se encontró, buscar por string exacta sin normalizar
      if (!jugadorGanador) {
        console.log('⚠️ Intento 2 falló, probando intento 3...');
        jugadorGanador = this.juego.jugadores.find(j => {
          const simboloStr = String(j.simbolo);
          const ganadorOriginal = String(ganador);
          const match = simboloStr === ganadorOriginal;
          console.log(`   Intento 3: "${simboloStr}" === "${ganadorOriginal}" = ${match}`);
          return match;
        });
      }
      
      if (jugadorGanador) {
        console.log('✅✅✅ JUGADOR GANADOR ENCONTRADO:', {
          id: jugadorGanador.id,
          simbolo: jugadorGanador.simbolo
        });
        this.juego.establecerGanador(jugadorGanador);
        console.log('🏆 Método establecerGanador() ejecutado');
        console.log('🏆 Estado del juego después:', this.juego.estado);
        console.log('🏆 Ganador en juego.ganador:', this.juego.ganador);
        console.log('🏆 Símbolo del ganador:', this.juego.ganador?.simbolo);
      } else {
        console.error('❌❌❌ NO SE PUDO ENCONTRAR AL JUGADOR GANADOR');
        console.error('❌ Esto NO debería pasar');
        console.error('❌ Datos para debugging:', {
          ganadorRecibido: ganador,
          ganadorProcesado: ganadorStr,
          jugadores: this.juego.jugadores.map(j => ({
            id: j.id,
            simbolo: j.simbolo,
            simboloString: String(j.simbolo)
          }))
        });
        // Marcar como finalizado sin ganador (será empate)
        this.juego.estado = EstadoJuego.Finalizado;
        console.error('❌ Marcado como finalizado sin ganador (aparecerá como EMPATE)');
      }
    } else if (this.tableroLleno(this.juego)) {
      console.log('🤝 No hay ganador y tablero lleno = EMPATE REAL');
      this.juego.estado = EstadoJuego.Finalizado;
      (this.juego as any)._ganador = null;
    } else {
      console.log('⏳ Juego continúa - no hay ganador y tablero no lleno');
    }

    console.log('📊 ESTADO FINAL DESPUÉS DE ACTUALIZAR:');
    console.log('   - Estado:', this.juego.estado);
    console.log('   - Ganador (objeto):', this.juego.ganador);
    console.log('   - Ganador símbolo:', this.juego.ganador?.simbolo);
    console.log('   - Ganador es null:', this.juego.ganador === null);
    console.log('📥 ==========================================');
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
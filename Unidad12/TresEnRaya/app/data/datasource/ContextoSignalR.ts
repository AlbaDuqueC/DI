import * as signalR from '@microsoft/signalr';

export class ContextoSignalR {
  private connection: signalR.HubConnection | null = null;
  private readonly urlServidor = "https://localhost:7190/gameHub";
  //private readonly urlServidor = "https://tresenrayaasp-albaduque-gmcvafhhbsfrhnbm.spaincentral-01.azurewebsites.net/gameHub";
  
  private onAsignarSimboloCallback?: (simbolo: string) => void;
  private onJuegoIniciadoCallback?: (data: any) => void;
  private onActualizarTableroCallback?: (data: any) => void;
  private onJuegoTerminadoCallback?: (data: any) => void;
  private onErrorCallback?: (mensaje: string) => void;
  private onPartidaLlenaCallback?: (mensaje: string) => void;
  private onEsperarOponenteCallback?: (data: any) => void;

  // 🆕 Flag para evitar reconexiones cuando la partida está llena
  private partidaLlena: boolean = false;

  async conectar(): Promise<boolean> {
    try {
      // Si la partida está llena, no intentar reconectar
      if (this.partidaLlena) {
        console.log('⚠️ No se puede conectar: partida llena');
        return false;
      }

      // Limpieza profunda de conexión previa
      if (this.connection) {
        await this.connection.stop().catch(() => {});
        this.connection = null;
      }

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.urlServidor, {
          withCredentials: false,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .configureLogging(signalR.LogLevel.Information)
        // 🔧 SIN reconexión automática - lo manejamos manualmente
        // .withAutomaticReconnect() - DESHABILITADO
        .build();

      this.registrarEventHandlers();

      // Manejo de cierre de conexión
      this.connection.onclose((error) => {
        console.log('❌ Conexión cerrada:', error?.message);
        
        // Si fue por partida llena, no hacer nada más
        if (this.partidaLlena) {
          console.log('🚫 Conexión cerrada: partida llena');
          return;
        }
        
        // Para otros errores, intentar reconectar UNA VEZ después de 3 segundos
        if (error) {
          console.error('⚠️ Error de conexión inesperado:', error);
          console.log('🔄 Intentando reconectar en 3 segundos...');
          
          setTimeout(() => {
            if (!this.connection || this.connection.state === signalR.HubConnectionState.Disconnected) {
              console.log('🔄 Reconectando...');
              this.connection?.start()
                .then(() => {
                  console.log('✅ Reconectado exitosamente');
                })
                .catch(err => {
                  console.error('❌ Fallo al reconectar:', err);
                });
            }
          }, 3000);
        }
      });

      await this.connection.start();
      console.log('✅ CONECTADO EXITOSAMENTE. ID:', this.connection.connectionId);
      this.partidaLlena = false; // Resetear flag al conectar
      return true;

    } catch (error: any) {
      console.error('❌ ERROR AL CONECTAR:', error.message);
      return false;
    }
  }

  private registrarEventHandlers(): void {
    if (!this.connection) return;

    // 🆕 NUEVO EVENTO: PartidaLlena
    this.connection.off('PartidaLlena');
    this.connection.on('PartidaLlena', (data: any) => {
      console.log('🚫 PartidaLlena recibido:', data);
      this.partidaLlena = true;
      
      // Notificar al callback si existe
      if (this.onPartidaLlenaCallback) {
        this.onPartidaLlenaCallback(data.mensaje || 'La partida está llena');
      }
      
      // Desconectar inmediatamente para evitar reconexión automática
      this.desconectar();
    });

    // EsperarOponente
    this.connection.off('EsperarOponente');
    this.connection.on('EsperarOponente', (data: any) => {
      console.log('⏳ EsperarOponente:', data);
      if (this.onEsperarOponenteCallback) {
        this.onEsperarOponenteCallback(data);
      }
    });

    // AsignarSimbolo
    this.connection.off('AsignarSimbolo');
    this.connection.on('AsignarSimbolo', (simbolo: string) => {
      console.log('📥 AsignarSimbolo:', simbolo);
      this.onAsignarSimboloCallback?.(simbolo);
    });

    // JuegoIniciado
    this.connection.off('JuegoIniciado');
    this.connection.on('JuegoIniciado', (data: any) => {
      console.log('📥 JuegoIniciado:', data);
      this.onJuegoIniciadoCallback?.(data);
    });

    // ActualizarTablero
    this.connection.off('ActualizarTablero');
    this.connection.on('ActualizarTablero', (data: any) => {
      console.log('📥 ActualizarTablero:', data);
      this.onActualizarTableroCallback?.(data);
    });

    // JuegoTerminado
    this.connection.off('JuegoTerminado');
    this.connection.on('JuegoTerminado', (data: any) => {
      console.log('📥 JuegoTerminado:', data);
      this.onJuegoTerminadoCallback?.(data);
    });

    // Error
    this.connection.off('Error');
    this.connection.on('Error', (mensaje: string) => {
      console.error('📥 Error servidor:', mensaje);
      this.onErrorCallback?.(mensaje);
    });

    // JugadorDesconectado
    this.connection.off('JugadorDesconectado');
    this.connection.on('JugadorDesconectado', (data: any) => {
      console.log('📥 JugadorDesconectado:', data);
      alert(data.mensaje || 'Oponente desconectado');
    });

    // JuegoReiniciado
    this.connection.off('JuegoReiniciado');
    this.connection.on('JuegoReiniciado', (data: any) => {
      console.log('📥 JuegoReiniciado:', data);
      // El componente principal manejará esto
    });
  }

  configurarCallbacks(callbacks: {
    onAsignarSimbolo?: (simbolo: string) => void;
    onJuegoIniciado?: (data: any) => void;
    onActualizarTablero?: (data: any) => void;
    onJuegoTerminado?: (data: any) => void;
    onError?: (mensaje: string) => void;
    onPartidaLlena?: (mensaje: string) => void;
    onEsperarOponente?: (data: any) => void;
  }): void {
    this.onAsignarSimboloCallback = callbacks.onAsignarSimbolo;
    this.onJuegoIniciadoCallback = callbacks.onJuegoIniciado;
    this.onActualizarTableroCallback = callbacks.onActualizarTablero;
    this.onJuegoTerminadoCallback = callbacks.onJuegoTerminado;
    this.onErrorCallback = callbacks.onError;
    this.onPartidaLlenaCallback = callbacks.onPartidaLlena;
    this.onEsperarOponenteCallback = callbacks.onEsperarOponente;
  }

  async enviarMovimiento(fila: number, columna: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn('⚠️ No se puede enviar movimiento: No hay conexión activa');
      throw new Error('No hay conexión con el servidor');
    }

    try {
      await this.connection.invoke('SendMove', {
        movimiento: [fila, columna]
      });
      console.log('✅ Movimiento enviado:', [fila, columna]);
    } catch (err: any) {
      console.error('❌ Error al enviar movimiento:', err.message);
      throw err;
    }
  }

  async reiniciarJuego(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('ReiniciarJuego');
        console.log('✅ Reinicio solicitado');
      } catch (err: any) {
        console.error('❌ Error al reiniciar:', err.message);
        throw err;
      }
    } else {
      throw new Error('No hay conexión con el servidor');
    }
  }

  escucharEvento(evento: string, handler: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.off(evento);
      this.connection.on(evento, handler);
    }
  }

  desconectar(): void {
    if (this.connection) {
      this.connection.stop().catch(err => {
        console.error('Error al desconectar:', err);
      });
      this.connection = null;
      console.log('🔌 Desconectado manualmente');
    }
  }

  obtenerEstadoConexion(): string {
    if (!this.connection) return 'Disconnected';
    
    switch (this.connection.state) {
      case signalR.HubConnectionState.Connected:
        return 'Conectado';
      case signalR.HubConnectionState.Connecting:
        return 'Conectando...';
      case signalR.HubConnectionState.Reconnecting:
        return 'Reconectando...';
      case signalR.HubConnectionState.Disconnected:
        return 'Desconectado';
      case signalR.HubConnectionState.Disconnecting:
        return 'Desconectando...';
      default:
        return 'Desconocido';
    }
  }

  estaConectado(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // 🆕 Método para resetear el flag de partida llena
  resetearPartidaLlena(): void {
    this.partidaLlena = false;
  }

  // 🆕 Método para verificar si la partida está llena
  esPartidaLlena(): boolean {
    return this.partidaLlena;
  }
}
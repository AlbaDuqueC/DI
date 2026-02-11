import * as signalR from '@microsoft/signalr';

export class ContextoSignalR {
  private connection: signalR.HubConnection | null = null;

  private readonly urlServidor = "https://tresenrayaasp-albaduque-gmcvafhhbsfrhnbm.spaincentral-01.azurewebsites.net/gameHub";

  
  private onAsignarSimboloCallback?: (simbolo: string) => void;
  private onJuegoIniciadoCallback?: (data: any) => void;
  private onActualizarTableroCallback?: (data: any) => void;
  private onJuegoTerminadoCallback?: (data: any) => void;
  private onErrorCallback?: (mensaje: string) => void;
  private onPartidaLlenaCallback?: (mensaje: string) => void;
  private onEsperarOponenteCallback?: (data: any) => void;

  private partidaLlena: boolean = false;

  async conectar(): Promise<boolean> {
    try {
      if (this.partidaLlena) {
        console.log('⚠️ No se puede conectar: partida llena');
        return false;
      }

      if (this.connection) {
        await this.connection.stop().catch(() => {});
        this.connection = null;
      }

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.urlServidor, {
          withCredentials: true,
          transport: signalR.HttpTransportType.LongPolling

        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.registrarEventHandlers();

      this.connection.onclose((error) => {
        console.log('❌ Conexión cerrada:', error?.message);
        
        if (this.partidaLlena) {
          console.log('🚫 Conexión cerrada: partida llena');
          return;
        }
      });

      await this.connection.start();
      console.log('✅ CONECTADO. ID:', this.connection.connectionId);
      this.partidaLlena = false;
      return true;

    } catch (error: any) {
      console.error('❌ ERROR AL CONECTAR:', error.message);
      return false;
    }
  }

  private registrarEventHandlers(): void {
    if (!this.connection) return;

    this.connection.off('PartidaLlena');
    this.connection.on('PartidaLlena', (data: any) => {
      console.log('🚫 PartidaLlena recibido:', data);
      this.partidaLlena = true;
      
      if (this.onPartidaLlenaCallback) {
        this.onPartidaLlenaCallback(data.mensaje || 'La partida está llena');
      }
      
      this.desconectar();
    });

    this.connection.off('EsperarOponente');
    this.connection.on('EsperarOponente', (data: any) => {
      console.log('⏳ EsperarOponente:', data);
      this.onEsperarOponenteCallback?.(data);
    });

    this.connection.off('AsignarSimbolo');
    this.connection.on('AsignarSimbolo', (simbolo: string) => {
      console.log('📥 AsignarSimbolo:', simbolo);
      this.onAsignarSimboloCallback?.(simbolo);
    });

    this.connection.off('JuegoIniciado');
    this.connection.on('JuegoIniciado', (data: any) => {
      console.log('📥 JuegoIniciado:', data);
      this.onJuegoIniciadoCallback?.(data);
    });

    this.connection.off('ActualizarTablero');
    this.connection.on('ActualizarTablero', (data: any) => {
      console.log('📥 ActualizarTablero:', data);
      this.onActualizarTableroCallback?.(data);
    });

    this.connection.off('JuegoTerminado');
    this.connection.on('JuegoTerminado', (data: any) => {
      console.log('📥 JuegoTerminado:', data);
      this.onJuegoTerminadoCallback?.(data);
    });

    this.connection.off('Error');
    this.connection.on('Error', (mensaje: string) => {
      console.error('📥 Error servidor:', mensaje);
      this.onErrorCallback?.(mensaje);
    });

    this.connection.off('JugadorDesconectado');
    this.connection.on('JugadorDesconectado', (data: any) => {
      console.log('📥 JugadorDesconectado:', data);
      alert(data.mensaje || 'Oponente desconectado');
    });

    this.connection.off('JuegoReiniciado');
    this.connection.on('JuegoReiniciado', (data: any) => {
      console.log('📥 JuegoReiniciado:', data);
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

  desconectar(): void {
    if (this.connection) {
      this.connection.stop().catch(err => {
        console.error('Error al desconectar:', err);
      });
      this.connection = null;
      console.log('🔌 Desconectado');
    }
  }

  obtenerEstadoConexion(): string {
    if (!this.connection) return 'Desconectado';
    
    switch (this.connection.state) {
      case signalR.HubConnectionState.Connected:
        return 'Conectado';
      case signalR.HubConnectionState.Connecting:
        return 'Conectando...';
      case signalR.HubConnectionState.Reconnecting:
        return 'Reconectando...';
      case signalR.HubConnectionState.Disconnected:
        return 'Desconectado';
      default:
        return 'Desconocido';
    }
  }

  estaConectado(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  resetearPartidaLlena(): void {
    this.partidaLlena = false;
  }

  esPartidaLlena(): boolean {
    return this.partidaLlena;
  }
}

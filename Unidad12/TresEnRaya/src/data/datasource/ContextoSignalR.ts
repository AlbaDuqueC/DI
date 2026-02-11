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
  private onJuegoReiniciadoCallback?: (data: any) => void; // Añadido

  private partidaLlena: boolean = false;

  async conectar(): Promise<boolean> {
    try {
      if (this.partidaLlena) return false;
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
      await this.connection.start();
      return true;
    } catch (error: any) {
      return false;
    }
  }

  private registrarEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('PartidaLlena', (data: any) => {
      this.partidaLlena = true;
      this.onPartidaLlenaCallback?.(data.mensaje || 'La partida está llena');
      this.desconectar();
    });

    this.connection.on('EsperarOponente', (data: any) => {
      this.onEsperarOponenteCallback?.(data);
    });

    this.connection.on('AsignarSimbolo', (simbolo: string) => {
      this.onAsignarSimboloCallback?.(simbolo);
    });

    this.connection.on('JuegoIniciado', (data: any) => {
      this.onJuegoIniciadoCallback?.(data);
    });

    this.connection.on('ActualizarTablero', (data: any) => {
      this.onActualizarTableroCallback?.(data);
    });

    this.connection.on('JuegoTerminado', (data: any) => {
      this.onJuegoTerminadoCallback?.(data);
    });

    this.connection.on('JuegoReiniciado', (data: any) => {
      console.log('📥 Sincronizando reinicio...');
      this.onJuegoReiniciadoCallback?.(data);
    });

    this.connection.on('Error', (mensaje: string) => {
      this.onErrorCallback?.(mensaje);
    });
  }

  configurarCallbacks(callbacks: any): void {
    this.onAsignarSimboloCallback = callbacks.onAsignarSimbolo;
    this.onJuegoIniciadoCallback = callbacks.onJuegoIniciado;
    this.onActualizarTableroCallback = callbacks.onActualizarTablero;
    this.onJuegoTerminadoCallback = callbacks.onJuegoTerminado;
    this.onErrorCallback = callbacks.onError;
    this.onPartidaLlenaCallback = callbacks.onPartidaLlena;
    this.onEsperarOponenteCallback = callbacks.onEsperarOponente;
    this.onJuegoReiniciadoCallback = callbacks.onJuegoReiniciado; // Añadido
  }

  async enviarMovimiento(fila: number, columna: number): Promise<void> {
    await this.connection?.invoke('SendMove', { movimiento: [fila, columna] });
  }

  async reiniciarJuego(): Promise<void> {
    await this.connection?.invoke('ReiniciarJuego');
  }

  desconectar(): void {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }

  obtenerEstadoConexion(): string {
    return this.connection?.state || 'Desconectado';
  }

  estaConectado(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  resetearPartidaLlena(): void { this.partidaLlena = false; }
  esPartidaLlena(): boolean { return this.partidaLlena; }
}
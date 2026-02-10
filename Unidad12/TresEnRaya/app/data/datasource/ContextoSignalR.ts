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

  async conectar(): Promise<boolean> {
    try {
      // FIX 1: Limpieza profunda de conexión previa para evitar duplicidad de IDs
      if (this.connection) {
        await this.connection.stop().catch(() => {});
        this.connection = null;
      }

      // Dentro de tu método conectar()
this.connection = new signalR.HubConnectionBuilder()
  .withUrl(this.urlServidor, {
    skipNegotiation: false,
    // Forzamos WebSockets y LongPolling (quitamos SSE que da problemas en navegadores con certificados locales)
    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
  })
  .withAutomaticReconnect([2000, 5000, 10000])
  .build();

      this.registrarEventHandlers();

      // Manejo de eventos de estado
      this.connection.onreconnecting((error) => console.log('🔄 Reconectando...', error));
      this.connection.onreconnected((id) => console.log('✅ Reconectado ID:', id));
      this.connection.onclose((error) => console.log('❌ Conexión cerrada:', error));

      await this.connection.start();
      console.log('✅ CONECTADO EXITOSAMENTE. ID:', this.connection.connectionId);
      return true;
      
    } catch (error) {
      console.error('❌ ERROR AL CONECTAR:', error);
      return false;
    }
  }

  private registrarEventHandlers(): void {
    if (!this.connection) return;

    // Limpiamos con .off antes de .on para evitar que los eventos se disparen varias veces
    this.connection.off('AsignarSimbolo');
    this.connection.on('AsignarSimbolo', (simbolo: string) => {
      console.log('📥 AsignarSimbolo:', simbolo);
      this.onAsignarSimboloCallback?.(simbolo);
    });

    this.connection.off('JuegoIniciado');
    this.connection.on('JuegoIniciado', (data: any) => {
      this.onJuegoIniciadoCallback?.(data);
    });

    this.connection.off('ActualizarTablero');
    this.connection.on('ActualizarTablero', (data: any) => {
      this.onActualizarTableroCallback?.(data);
    });

    this.connection.off('JuegoTerminado');
    this.connection.on('JuegoTerminado', (data: any) => {
        this.onJuegoTerminadoCallback?.(data);
    });

    this.connection.off('Error');
    this.connection.on('Error', (mensaje: string) => {
      console.error('📥 Error servidor:', mensaje);
      // FIX: Si la partida está llena, detenemos la conexión para evitar el bucle de reconexión
      if (mensaje.includes("llena")) {
          this.desconectar();
      }
      this.onErrorCallback?.(mensaje);
    });

    this.connection.off('JugadorDesconectado');
    this.connection.on('JugadorDesconectado', (data: any) => {
        alert(data.mensaje || "Oponente desconectado");
    });
  }

  configurarCallbacks(callbacks: any): void {
    this.onAsignarSimboloCallback = callbacks.onAsignarSimbolo;
    this.onJuegoIniciadoCallback = callbacks.onJuegoIniciado;
    this.onActualizarTableroCallback = callbacks.onActualizarTablero;
    this.onJuegoTerminadoCallback = callbacks.onJuegoTerminado;
    this.onErrorCallback = callbacks.onError;
  }

  async enviarMovimiento(fila: number, columna: number) {
    // FIX 2: Validación estricta para eliminar el error "Object is possibly null"
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        console.warn("⚠️ No se puede enviar movimiento: No hay conexión activa.");
        return;
    }

    try {
        // Usamos la conexión garantizada por el check anterior
        await this.connection.invoke("SendMove", {
            movimiento: [fila, columna]
        });
    } catch (err) {
        console.error("❌ Error al enviar movimiento:", err);
    }
  }

  async reiniciarJuego(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('ReiniciarJuego').catch(e => console.error(e));
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
      this.connection.stop();
      this.connection = null;
      console.log('🔌 Desconectado manualmente');
    }
  }

  obtenerEstadoConexion(): string {
    return this.connection?.state || 'Disconnected';
  }

  estaConectado(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}
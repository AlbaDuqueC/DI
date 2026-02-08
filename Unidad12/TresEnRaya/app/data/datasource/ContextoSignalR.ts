import * as signalR from '@microsoft/signalr';

export class ContextoSignalR {
  private connection: signalR.HubConnection | null = null;
  private readonly urlAzure = 'https://tresenrayaasp-albaduque-gmcvafhhbsfrhnbm.spaincentral-01.azurewebsites.net/gameHub'; // CAMBIAR


  async conectar(): Promise<boolean> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.urlAzure)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      await this.connection.start();
      console.log('Conectado a SignalR Azure');
      return true;
    } catch (error) {
      console.error('Error al conectar:', error);
      return false;
    }
  }

  async enviarMovimiento(fila: number, columna: number): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      const jugada = { movimiento: [fila, columna] };
      await this.connection.invoke('SendMove', jugada);
    }
  }

  escucharEvento(evento: string, handler: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.on(evento, handler);
    }
  }

  desconectar(): void {
    if (this.connection) {
      this.connection.stop();
    }
  }

  obtenerEstadoConexion(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }
}
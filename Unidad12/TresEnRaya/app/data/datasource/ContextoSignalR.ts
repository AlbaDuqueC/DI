import * as signalR from '@microsoft/signalr';

export class ContextoSignalR {
  private connection: signalR.HubConnection | null = null;
  

  private readonly urlServidor = 'https://tresenrayaasp-albaduque-gmcvafhhbsfrhnbm.spaincentral-01.azurewebsites.net/gameHub';

  async conectar(): Promise<boolean> {
    try {
      console.log('🔄 Intentando conectar a:', this.urlServidor);
      
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.urlServidor)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 0) return 2000;
            if (retryContext.previousRetryCount === 1) return 5000;
            return 10000;
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.connection.onreconnecting((error) => {
        console.log('🔄 Reconectando...', error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log('✅ Reconectado con ID:', connectionId);
      });

      this.connection.onclose((error) => {
        console.log('❌ Conexión cerrada:', error);
      });

      await this.connection.start();
      console.log('✅ CONECTADO EXITOSAMENTE a:', this.urlServidor);
      console.log('Connection ID:', this.connection.connectionId);
      return true;
      
    } catch (error) {
      console.error('❌ ERROR AL CONECTAR:', error);
      console.error('URL intentada:', this.urlServidor);
      return false;
    }
  }

  async enviarMovimiento(fila: number, columna: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('❌ No hay conexión activa');
      throw new Error('No estás conectado al servidor');
    }

    try {
      const jugada = { movimiento: [fila, columna] };
      console.log('📤 Enviando movimiento:', jugada);
      await this.connection.invoke('SendMove', jugada);
      console.log('✅ Movimiento enviado correctamente');
    } catch (error) {
      console.error('❌ Error al enviar movimiento:', error);
      throw error;
    }
  }

  escucharEvento(evento: string, handler: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.on(evento, (...args) => {
        console.log(`📥 Evento recibido [${evento}]:`, args);
        handler(...args);
      });
    }
  }

  desconectar(): void {
    if (this.connection) {
      this.connection.stop();
      console.log('🔌 Desconectado de SignalR');
    }
  }

  obtenerEstadoConexion(): string {
    if (!this.connection) return 'Desconectado';
    
    switch (this.connection.state) {
      case signalR.HubConnectionState.Connected:
        return 'Conectado ✅';
      case signalR.HubConnectionState.Connecting:
        return 'Conectando... 🔄';
      case signalR.HubConnectionState.Disconnected:
        return 'Desconectado ❌';
      case signalR.HubConnectionState.Disconnecting:
        return 'Desconectando... 🔄';
      case signalR.HubConnectionState.Reconnecting:
        return 'Reconectando... 🔄';
      default:
        return 'Desconocido';
    }
  }

  estaConectado(): boolean {
    return this.connection !== null && 
           this.connection.state === signalR.HubConnectionState.Connected;
  }
}

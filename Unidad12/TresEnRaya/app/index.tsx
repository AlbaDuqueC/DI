import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Container } from './core/Container';
import { JuegoView } from './ui/view/JuegoView';
import { Juego } from './domain/entities/Juego';

export default function Index() {
  const [container] = useState(() => Container.getInstance());
  const [conectado, setConectado] = useState(false);
  const [estadoConexion, setEstadoConexion] = useState('Desconectado');
  const [juego, setJuego] = useState<Juego | null>(null);
  const [esperandoOponente, setEsperandoOponente] = useState(false);
  const [miSimbolo, setMiSimbolo] = useState<string | null>(null);
  const [actualizacion, setActualizacion] = useState(0);
  const [intentosConexion, setIntentosConexion] = useState(0);

  useEffect(() => {
    conectarServidor();
    
    // Verificar estado de conexión cada 3 segundos
    const intervalo = setInterval(() => {
      const estado = container.contextoSignalR.obtenerEstadoConexion();
      setEstadoConexion(estado);
    }, 3000);

    return () => {
      clearInterval(intervalo);
      container.contextoSignalR.desconectar();
    };
  }, []);

  const conectarServidor = async () => {
    console.log('🔄 Intentando conectar al servidor...');
    setIntentosConexion(prev => prev + 1);
    
    const resultado = await container.contextoSignalR.conectar();
    setConectado(resultado);

    if (resultado) {
      console.log('✅ Conexión establecida');
      setEstadoConexion('Conectado');
      configurarEventos();
      
      // Crear juego automáticamente al conectarse
      const nuevoJuego = container.juegoViewModel.crearJuegoNuevo(Date.now());
      setJuego(nuevoJuego);
    } else {
      console.error('❌ No se pudo conectar al servidor');
      setEstadoConexion('Error de conexión');
      
      Alert.alert(
        'Error de Conexión',
        '¿El servidor ASP.NET está ejecutándose?\n\nAsegúrate de:\n1. Tener el backend ejecutándose\n2. La URL en ContextoSignalR.ts sea correcta',
        [
          { text: 'Reintentar', onPress: conectarServidor },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  const configurarEventos = () => {
    console.log('📡 Configurando eventos de SignalR...');

    // Primer jugador esperando
    container.contextoSignalR.escucharEvento('EsperarOponente', (data: any) => {
      console.log('👤 Primer jugador - Esperando oponente');
      setEsperandoOponente(true);
      setMiSimbolo(data.simbolo);
      container.repositorioJuego.establecerMiSimbolo(data.simbolo);
      
      const juegoActual = container.juegoViewModel.obtenerJuego(1);
      setJuego(juegoActual);
      setActualizacion(prev => prev + 1);
    });

    // Asignar símbolo
    container.contextoSignalR.escucharEvento('AsignarSimbolo', (simbolo: string) => {
      console.log('🎯 Símbolo asignado:', simbolo);
      setMiSimbolo(simbolo);
      container.repositorioJuego.establecerMiSimbolo(simbolo);
      
      const juegoActual = container.juegoViewModel.obtenerJuego(1);
      setJuego(juegoActual);
      setActualizacion(prev => prev + 1);
    });

    // Juego iniciado (segundo jugador se conectó)
    container.contextoSignalR.escucharEvento('JuegoIniciado', (data: any) => {
      console.log('🎮 Juego iniciado - 2 jugadores conectados');
      setEsperandoOponente(false);
      container.repositorioJuego.actualizarDesdeServidor(data.tablero, null);
      container.repositorioJuego.actualizarTurno(data.turno);
      
      const juegoActual = container.juegoViewModel.obtenerJuego(1);
      setJuego(juegoActual);
      setActualizacion(prev => prev + 1);
    });

    // Actualizar tablero después de movimiento
    container.contextoSignalR.escucharEvento('ActualizarTablero', (data: any) => {
      console.log('📊 Tablero actualizado desde servidor');
      container.repositorioJuego.actualizarDesdeServidor(data.tablero, data.ganador);
      container.repositorioJuego.actualizarTurno(data.turno);
      
      const juegoActual = container.juegoViewModel.obtenerJuego(1);
      setJuego(juegoActual);
      setActualizacion(prev => prev + 1);
    });

    // Juego terminado
    container.contextoSignalR.escucharEvento('JuegoTerminado', (data: any) => {
      console.log('🏁 Juego terminado');
      Alert.alert('Fin del Juego', data.mensaje);
    });

    // Jugador desconectado
    container.contextoSignalR.escucharEvento('JugadorDesconectado', (mensaje: string) => {
      console.log('👋 Jugador desconectado');
      Alert.alert('Desconexión', mensaje);
      reiniciarJuego();
    });

    // Errores
    container.contextoSignalR.escucharEvento('Error', (mensaje: string) => {
      console.error('❌ Error del servidor:', mensaje);
      Alert.alert('Error', mensaje);
    });

    console.log('✅ Eventos configurados correctamente');
  };

  const realizarMovimiento = async (fila: number, columna: number) => {
    console.log('🎯 Click en casilla:', { fila, columna });

    if (!container.contextoSignalR.estaConectado()) {
      Alert.alert('Sin Conexión', 'No estás conectado al servidor');
      return;
    }

    if (esperandoOponente) {
      Alert.alert('Espera', 'Esperando al oponente...');
      return;
    }

    if (!juego) {
      Alert.alert('Error', 'No hay juego activo');
      return;
    }

    try {
      const miIdJugador = container.repositorioJuego.obtenerMiIdJugador();
      
      if (!miIdJugador) {
        Alert.alert('Error', 'No se pudo identificar tu jugador');
        return;
      }

      console.log('📤 Intentando realizar movimiento...');
      
      await container.juegoViewModel.hacerMovimiento(1, miIdJugador, fila, columna);
      
      // Actualizar UI inmediatamente
      const juegoActualizado = container.juegoViewModel.obtenerJuego(1);
      setJuego(juegoActualizado);
      setActualizacion(prev => prev + 1);
      
      console.log('✅ Movimiento realizado correctamente');
      
    } catch (error: any) {
      console.error('❌ Error al realizar movimiento:', error);
      Alert.alert('Error', error.message || 'No se pudo realizar el movimiento');
    }
  };

  const reiniciarJuego = () => {
    console.log('🔄 Reiniciando juego...');
    setEsperandoOponente(false);
    setMiSimbolo(null);
    setJuego(null);
    container.contextoSignalR.desconectar();
    setTimeout(() => {
      conectarServidor();
    }, 500);
  };

  if (!conectado) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.texto}>Conectando al servidor...</Text>
        <Text style={styles.textoEstado}>Estado: {estadoConexion}</Text>
        <Text style={styles.textoIntentos}>Intentos: {intentosConexion}</Text>
        
        <TouchableOpacity style={styles.botonReintentar} onPress={conectarServidor}>
          <Text style={styles.textoBoton}>Reintentar Conexión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tres en Raya</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.textoInfo}>Tu símbolo: {miSimbolo || '...'}</Text>
        <Text style={styles.textoInfo}>
          Estado: {esperandoOponente ? 'Esperando oponente...' : 'En juego'}
        </Text>
        <Text style={[styles.textoInfo, styles.textoConexion]}>
          Conexión: {estadoConexion}
        </Text>
      </View>

      {esperandoOponente && (
        <View style={styles.esperandoContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.textoEsperando}>Esperando oponente...</Text>
        </View>
      )}

      <JuegoView 
        juego={juego} 
        onCasillaTocada={realizarMovimiento}
        actualizacion={actualizacion}
      />

      <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarJuego}>
        <Text style={styles.textoBoton}>Nuevo Juego</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#34495E',
    fontWeight: '500',
  },
  textoConexion: {
    color: '#27AE60',
    fontWeight: 'bold',
  },
  esperandoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textoEsperando: {
    fontSize: 18,
    color: '#FF6B6B',
    marginTop: 10,
    fontWeight: '600',
  },
  botonReiniciar: {
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  botonReintentar: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  texto: {
    fontSize: 16,
    marginTop: 10,
    color: '#7F8C8D',
  },
  textoEstado: {
    fontSize: 14,
    marginTop: 5,
    color: '#95A5A6',
  },
  textoIntentos: {
    fontSize: 14,
    marginTop: 5,
    color: '#95A5A6',
  },
});
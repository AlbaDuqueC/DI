import React, { useState, useEffect, useRef } from 'react';
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
  const [partidaLlena, setPartidaLlena] = useState(false);

  const conectadoRef = useRef(false);
  const reconectarTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solo ejecutamos la conexión automática la primera vez
    if (!conectadoRef.current) {
      conectadoRef.current = true;
      conectarServidor();
    }

    const intervalo = setInterval(() => {
      const estado = container.contextoSignalR.obtenerEstadoConexion();
      setEstadoConexion(estado);
    }, 2000);

    return () => {
      clearInterval(intervalo);
      if (reconectarTimerRef.current) {
        clearTimeout(reconectarTimerRef.current);
      }
    };
  }, []);

  const reiniciarJuego = async () => {
    console.log('🔄 Solicitando reinicio al servidor...');
    
    try {
      await container.contextoSignalR.reiniciarJuego();
      
      // Limpiamos el estado local
      setEsperandoOponente(false);
      setMiSimbolo(null);
      setJuego(null);
      
      console.log('✅ Petición de reinicio enviada');
    } catch (error: any) {
      console.error('❌ Error al reiniciar:', error.message);
      Alert.alert('Error', 'No se pudo reiniciar el juego. Reconectando...');
      conectarServidor();
    }
  };

  const conectarServidor = async () => {
    console.log('🔄 Intentando conectar al servidor...');
    setIntentosConexion(prev => prev + 1);
    
    // Verificar si la partida está llena
    if (container.contextoSignalR.esPartidaLlena()) {
      console.log('⚠️ La partida está llena, no se puede conectar');
      setPartidaLlena(true);
      setConectado(false);
      return;
    }
    
    // 🎯 CONFIGURAR CALLBACKS ANTES DE CONECTAR
    container.contextoSignalR.configurarCallbacks({
      // 🆕 Callback para partida llena
      onPartidaLlena: (mensaje: string) => {
        console.log('🚫 Partida llena:', mensaje);
        setPartidaLlena(true);
        setConectado(false);
        
        Alert.alert(
          'Partida Llena',
          'La sala está completa (2/2 jugadores). Por favor espera o crea otra sala.',
          [
            { 
              text: 'Reintentar en 10s', 
              onPress: () => {
                // Resetear el flag y reintentar después de 10 segundos
                setTimeout(() => {
                  console.log('🔄 Reintentando después de 10 segundos...');
                  container.contextoSignalR.resetearPartidaLlena();
                  setPartidaLlena(false);
                  conectarServidor();
                }, 10000);
              }
            },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      },

      // Callback cuando debe esperar oponente
      onEsperarOponente: (data: any) => {
        console.log('⏳ Esperando oponente:', data);
        setEsperandoOponente(true);
        setMiSimbolo(data.simbolo);
      },

      // Callback cuando se asigna símbolo
      onAsignarSimbolo: (simbolo: string) => {
        console.log('🎯 Callback AsignarSimbolo:', simbolo);
        setMiSimbolo(simbolo);
        container.repositorioJuego.establecerMiSimbolo(simbolo);
        
        const juegoActual = container.juegoViewModel.obtenerJuego(1);
        setJuego(juegoActual);
        setActualizacion(prev => prev + 1);
      },

      // Callback cuando el juego inicia
      onJuegoIniciado: (data: any) => {
        console.log('🎮 Callback JuegoIniciado:', data);
        setEsperandoOponente(false);
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, null);
        container.repositorioJuego.actualizarTurno(data.turno);
        
        const juegoActual = container.juegoViewModel.obtenerJuego(1);
        setJuego(juegoActual);
        setActualizacion(prev => prev + 1);
        
        Alert.alert('¡Juego Iniciado!', 'Ambos jugadores conectados. ¡A jugar!');
      },

      // Callback cuando se actualiza el tablero
      onActualizarTablero: (data: any) => {
        console.log('📊 Callback ActualizarTablero:', data);
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, data.ganador);
        container.repositorioJuego.actualizarTurno(data.turno);
        
        const juegoActual = container.juegoViewModel.obtenerJuego(1);
        setJuego(juegoActual);
        setActualizacion(prev => prev + 1);
      },

      // Callback cuando termina el juego
      onJuegoTerminado: (data: any) => {
        console.log('🏁 Callback JuegoTerminado:', data);
        Alert.alert('Fin del Juego', data.mensaje, [
          { text: 'OK', onPress: () => console.log('Juego terminado') }
        ]);
      },

      // Callback de errores
      onError: (mensaje: string) => {
        console.error('❌ Callback Error:', mensaje);
        Alert.alert('Error', mensaje);
      }
    });

    const resultado = await container.contextoSignalR.conectar();
    setConectado(resultado);

    if (resultado) {
      console.log('✅ Conexión establecida');
      setEstadoConexion('Conectado');
      setPartidaLlena(false);
      
      // Crear juego automáticamente al conectarse
      const nuevoJuego = container.juegoViewModel.crearJuegoNuevo(Date.now());
      setJuego(nuevoJuego);
      
      // Marcar como esperando oponente inicialmente
      setEsperandoOponente(true);
    } else {
      console.error('❌ No se pudo conectar al servidor');
      setEstadoConexion('Error de conexión');
      
      if (!container.contextoSignalR.esPartidaLlena()) {
        Alert.alert(
          'Error de Conexión',
          '¿El servidor ASP.NET está ejecutándose?\n\nAsegúrate de:\n1. Tener el backend ejecutándose\n2. La URL en ContextoSignalR.ts sea correcta',
          [
            { text: 'Reintentar', onPress: conectarServidor },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      }
    }
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
      
      // Actualizar UI inmediatamente (optimistic update)
      const juegoActualizado = container.juegoViewModel.obtenerJuego(1);
      setJuego(juegoActualizado);
      setActualizacion(prev => prev + 1);
      
      console.log('✅ Movimiento realizado correctamente');
      
    } catch (error: any) {
      console.error('❌ Error al realizar movimiento:', error);
      Alert.alert('Error', error.message || 'No se pudo realizar el movimiento');
      
      // Si hay error de conexión, intentar reconectar
      if (error.message?.includes('conexión')) {
        conectarServidor();
      }
    }
  };

  // Pantalla de partida llena
  if (partidaLlena) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>🚫 Partida Llena</Text>
        <Text style={styles.textoPartidaLlena}>
          La sala está completa (2/2 jugadores).
        </Text>
        <Text style={styles.textoPartidaLlena}>
          Por favor espera a que se libere un espacio.
        </Text>
        
        <TouchableOpacity 
          style={styles.botonReintentar} 
          onPress={() => {
            container.contextoSignalR.resetearPartidaLlena();
            setPartidaLlena(false);
            conectarServidor();
          }}
        >
          <Text style={styles.textoBoton}>Reintentar Conexión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de conexión
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

  // Pantalla principal del juego
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tres en Raya</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.textoInfo}>Tu símbolo: {miSimbolo || '...'}</Text>
        <Text style={styles.textoInfo}>
          Estado: {esperandoOponente ? '⏳ Esperando oponente...' : '🎮 En juego'}
        </Text>
        <Text style={[styles.textoInfo, styles.textoConexion]}>
          Conexión: {estadoConexion}
        </Text>
      </View>

      {esperandoOponente && (
        <View style={styles.esperandoContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.textoEsperando}>Esperando al segundo jugador...</Text>
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
  textoPartidaLlena: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
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
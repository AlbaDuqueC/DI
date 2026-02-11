import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Container } from '../src/core/Container';
import { JuegoView } from '../src/ui/view/JuegoView';
import { Juego } from '../src/domain/entities/Juego';
import { Jugador } from '../src/domain/entities/Jugador';

const { width } = Dimensions.get('window');

export default function Index() {
  const [container] = useState(() => Container.getInstance());
  const [conectado, setConectado] = useState(false);
  const [estadoConexion, setEstadoConexion] = useState('Desconectado');
  const [juego, setJuego] = useState<Juego | null>(null);
  const [esperandoOponente, setEsperandoOponente] = useState(false);
  const [miSimbolo, setMiSimbolo] = useState<string | null>(null);
  const [actualizacion, setActualizacion] = useState(0);

  const conectadoRef = useRef(false);

  const actualizarEstadoLocal = () => {
    const juegoActual = container.juegoViewModel.obtenerJuego(1);
    if (!juegoActual) return;
    
    console.log('🔄 Estado actualizado:', {
      jugadores: juegoActual.jugadores.map((j: Jugador) => ({
        simbolo: j.simbolo,
        esTurno: j.esTurno
      })),
      miSimbolo: miSimbolo
    });
    
    // Forzar re-render con timestamp único
    setActualizacion(Date.now());
    setJuego(juegoActual);
  };

  useEffect(() => {
    if (!conectadoRef.current) {
      conectadoRef.current = true;
      conectarServidor();
    }
    
    const intervalo = setInterval(() => {
      setEstadoConexion(container.contextoSignalR.obtenerEstadoConexion());
    }, 2000);
    
    return () => clearInterval(intervalo);
  }, []);

  const conectarServidor = async () => {
    container.contextoSignalR.configurarCallbacks({
      onAsignarSimbolo: (simbolo: string) => {
        console.log('🎯 Símbolo asignado:', simbolo);
        setMiSimbolo(simbolo);
        container.repositorioJuego.establecerMiSimbolo(simbolo);
        setTimeout(() => actualizarEstadoLocal(), 50);
      },
      onEsperarOponente: (data: any) => {
        console.log('⏳ Esperando oponente');
        setEsperandoOponente(true);
        setMiSimbolo(data.simbolo);
        setTimeout(() => actualizarEstadoLocal(), 50);
      },
      onJuegoIniciado: (data: any) => {
        console.log('🎮 Juego iniciado:', data);
        setEsperandoOponente(false);
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, null);
        container.repositorioJuego.actualizarTurno(data.turno);
        setTimeout(() => actualizarEstadoLocal(), 50);
      },
      onActualizarTablero: (data: any) => {
        console.log('📋 Tablero actualizado:', {
          turno: data.turno,
          ganador: data.ganador
        });
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, data.ganador);
        container.repositorioJuego.actualizarTurno(data.turno);
        setTimeout(() => actualizarEstadoLocal(), 50);
      },
      onJuegoTerminado: (data: any) => {
        console.log('🏁 Juego terminado:', data);
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, data.ganador);
        setTimeout(() => actualizarEstadoLocal(), 50);
      },
      onJuegoReiniciado: (data: any) => {
        console.log('🔄 Juego reiniciado:', data);
        container.repositorioJuego.reiniciarEstadoLocal();
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, null);
        container.repositorioJuego.actualizarTurno(data.turno);
        setTimeout(() => actualizarEstadoLocal(), 50);
      },
      onPartidaLlena: (mensaje: string) => {
        console.log('🚫 Partida llena');
        Alert.alert('Partida Llena', mensaje);
      },
      onError: (mensaje: string) => {
        console.error('❌ Error:', mensaje);
        Alert.alert('Error', mensaje);
      }
    });

    const resultado = await container.contextoSignalR.conectar();
    setConectado(resultado);
    
    if (resultado) {
      container.juegoViewModel.crearJuegoNuevo(1);
      setTimeout(() => actualizarEstadoLocal(), 100);
    }
  };

  const realizarMovimiento = async (fila: number, columna: number) => {
    if (!juego || esperandoOponente) return;
    
    try {
      const miId = container.repositorioJuego.obtenerMiIdJugador();
      if (!miId) {
        console.log('❌ No hay ID de jugador');
        return;
      }
      
      console.log('🎲 Intentando movimiento:', { fila, columna, miId });
      
      await container.juegoViewModel.hacerMovimiento(1, miId, fila, columna);
      setTimeout(() => actualizarEstadoLocal(), 50);
    } catch (error: any) {
      console.log('⚠️ Movimiento no permitido:', error.message);
      Alert.alert('Movimiento no permitido', error.message);
    }
  };

  const manejarReinicio = async () => {
    try {
      await container.contextoSignalR.reiniciarJuego();
    } catch (e) {
      console.error('Error reiniciando:', e);
      Alert.alert('Error', 'No se pudo reiniciar el juego');
    }
  };

  if (!conectado) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#BA68C8" />
        <Text style={styles.textoCargando}>Conectando al servidor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>✨ Tres en Raya ✨</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.labelInfo}>
          Eres: <Text style={miSimbolo === 'X' ? styles.colorX : styles.colorO}>
            {miSimbolo || '...'}
          </Text>
        </Text>
        <Text style={styles.estadoConexion}>● {estadoConexion}</Text>
      </View>

      {esperandoOponente && (
        <Text style={styles.textoEsperando}>☁️ Esperando rival...</Text>
      )}

      <JuegoView 
        juego={juego} 
        onCasillaTocada={realizarMovimiento}
        onReiniciar={manejarReinicio}
        actualizacion={actualizacion}
        miSimbolo={miSimbolo}
      />
      
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3E5F5', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  titulo: { 
    fontSize: 42, 
    fontWeight: '900', 
    color: '#6A1B9A', 
    marginBottom: 30,
    textShadowColor: 'rgba(186, 104, 200, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  infoContainer: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 25, 
    width: width * 0.85, 
    marginBottom: 25, 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  labelInfo: { 
    fontSize: 20, 
    color: '#4A148C', 
    fontWeight: '700' 
  },
  colorX: { 
    color: '#F06292', 
    fontWeight: '900' 
  },
  colorO: { 
    color: '#BA68C8', 
    fontWeight: '900' 
  },
  estadoConexion: { 
    fontSize: 10, 
    color: '#9575CD', 
    marginTop: 5 
  },
  textoEsperando: { 
    color: '#D81B60', 
    fontWeight: 'bold', 
    marginBottom: 10,
    fontSize: 16
  },
  textoCargando: {
    marginTop: 15,
    color: '#6A1B9A',
    fontSize: 16
  }
});
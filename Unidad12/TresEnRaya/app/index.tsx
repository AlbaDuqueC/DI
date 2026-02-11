import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Container } from '../src/core/Container';
import { JuegoView } from '../src/ui/view/JuegoView';
import { Juego } from '../src/domain/entities/Juego';

export default function Index() {
  const [container] = useState(() => Container.getInstance());
  const [conectado, setConectado] = useState(false);
  const [estadoConexion, setEstadoConexion] = useState('Desconectado');
  const [juego, setJuego] = useState<Juego | null>(null);
  const [esperandoOponente, setEsperandoOponente] = useState(false);
  const [miSimbolo, setMiSimbolo] = useState<string | null>(null);
  const [actualizacion, setActualizacion] = useState(0);

  const conectadoRef = useRef(false);

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

  const actualizarEstadoLocal = () => {
    const juegoActual = container.juegoViewModel.obtenerJuego(1);
    setJuego(juegoActual);
    setActualizacion(prev => prev + 1);
  };

  const conectarServidor = async () => {
    container.contextoSignalR.configurarCallbacks({
      onAsignarSimbolo: (simbolo: string) => {
        setMiSimbolo(simbolo);
        container.repositorioJuego.establecerMiSimbolo(simbolo);
        actualizarEstadoLocal();
      },
      onEsperarOponente: (data: any) => {
        setEsperandoOponente(true);
        setMiSimbolo(data.simbolo);
      },
      onJuegoIniciado: (data: any) => {
        setEsperandoOponente(false);
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, null);
        container.repositorioJuego.actualizarTurno(data.turno);
        actualizarEstadoLocal();
      },
      onActualizarTablero: (data: any) => {
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, data.ganador);
        container.repositorioJuego.actualizarTurno(data.turno);
        actualizarEstadoLocal();
      },
      onJuegoTerminado: (data: any) => {
        container.repositorioJuego.actualizarDesdeServidor(data.tablero, data.ganador);
        actualizarEstadoLocal();
        Alert.alert('Fin del Juego', data.mensaje);
      },
      onError: (mensaje: string) => Alert.alert('Error', mensaje)
    });

    const resultado = await container.contextoSignalR.conectar();
    setConectado(resultado);

    if (resultado) {
      setJuego(container.juegoViewModel.crearJuegoNuevo(1));
    }
  };

  const realizarMovimiento = async (fila: number, columna: number) => {
    if (esperandoOponente || !juego) return;
    try {
      const miId = container.repositorioJuego.obtenerMiIdJugador();
      await container.juegoViewModel.hacerMovimiento(1, miId!, fila, columna);
      actualizarEstadoLocal();
    } catch (error: any) {
      console.log('Movimiento no permitido');
    }
  };

  if (!conectado) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.texto}>Conectando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tres en Raya</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.textoInfo}>Eres: {miSimbolo || '...'}</Text>
        <Text style={styles.textoInfo}>{estadoConexion}</Text>
      </View>

      {esperandoOponente && (
        <Text style={styles.textoEsperando}>⏳ Esperando rival...</Text>
      )}

      <JuegoView 
        juego={juego} 
        onCasillaTocada={realizarMovimiento}
        actualizacion={actualizacion}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8', alignItems: 'center', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 32, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  infoContainer: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: '90%', marginBottom: 20 },
  textoInfo: { fontSize: 16, color: '#34495E', textAlign: 'center' },
  textoEsperando: { fontSize: 18, color: '#E74C3C', marginBottom: 15, fontWeight: 'bold' },
  texto: { marginTop: 10, color: '#7F8C8D' }
});
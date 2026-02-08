import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Juego } from '../../domain/entities/Juego';
import { EstadoJuego } from '../../core/Type';

interface JuegoViewProps {
  juego: Juego | null;
  onCasillaTocada: (fila: number, columna: number) => void;
  actualizacion: number;
}

export const JuegoView: React.FC<JuegoViewProps> = ({ 
  juego, 
  onCasillaTocada,
  actualizacion 
}) => {
  if (!juego) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>No hay juego activo</Text>
      </View>
    );
  }

  const mostrarTablero = () => {
    return (
      <View style={styles.tableroContainer}>
        {[0, 1, 2].map((fila) => (
          <View key={fila} style={styles.fila}>
            {[0, 1, 2].map((columna) => {
              const valor = juego.tablero[fila][columna];
              const bloqueado = juego.estado === EstadoJuego.Finalizado;
              
              return (
                <TouchableOpacity
                  key={`${fila}-${columna}`}
                  style={styles.casilla}
                  onPress={() => onCasillaTocada(fila, columna)}
                  disabled={bloqueado}
                >
                  <Text style={styles.textoSimbolo}>
                    {valor !== null ? valor.toString() : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const mostrarTurnoActual = () => {
    const jugadorActual = juego.jugadores.find(j => j.esTurno);
    if (jugadorActual && juego.estado === EstadoJuego.EnCurso) {
      return (
        <Text style={styles.textoTurno}>
          Turno: {jugadorActual.simbolo.toString()}
        </Text>
      );
    }
    return null;
  };

  const mostrarResultado = () => {
    if (juego.estado === EstadoJuego.Finalizado) {
      if (juego.ganador) {
        return (
          <Text style={styles.textoResultado}>
            ¡Ganador: {juego.ganador.simbolo.toString()}!
          </Text>
        );
      } else {
        return (
          <Text style={styles.textoResultado}>
            ¡Empate!
          </Text>
        );
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {mostrarTurnoActual()}
      {mostrarTablero()}
      {mostrarResultado()}
      {juego.estado === EstadoJuego.Finalizado && (
        <Text style={styles.textoBloqueado}>Tablero bloqueado</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableroContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  fila: {
    flexDirection: 'row',
  },
  casilla: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    backgroundColor: '#ECF0F1',
    borderRadius: 10,
  },
  textoSimbolo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  texto: {
    fontSize: 18,
    color: '#7F8C8D',
  },
  textoTurno: {
    fontSize: 20,
    fontWeight: '600',
    color: '#27AE60',
    marginBottom: 10,
  },
  textoResultado: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginTop: 20,
  },
  textoBloqueado: {
    fontSize: 16,
    color: '#95A5A6',
    marginTop: 10,
  },
});
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
  if (!juego) return null;

  const esFinalizado = juego.estado === EstadoJuego.Finalizado;

  return (
    <View style={styles.container}>
      {/* Turno Actual */}
      {juego.estado === EstadoJuego.EnCurso && (
        <Text style={styles.textoTurno}>
          Turno de: {juego.jugadores.find(j => j.esTurno)?.simbolo}
        </Text>
      )}

      {/* Tablero */}
      <View style={styles.tableroContainer}>
        {juego.tablero.map((filaArr, fila) => (
          <View key={fila} style={styles.fila}>
            {filaArr.map((valor, columna) => (
              <TouchableOpacity
                key={`${fila}-${columna}`}
                style={styles.casilla}
                onPress={() => onCasillaTocada(fila, columna)}
                disabled={esFinalizado || valor !== null}
              >
                <Text style={[
                  styles.textoSimbolo, 
                  valor === 'X' ? styles.colorX : styles.colorO
                ]}>
                  {valor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Resultado Final sin botones */}
      {esFinalizado && (
        <Text style={styles.textoResultado}>
          {juego.ganador ? `¡Ganador: ${juego.ganador.simbolo}!` : '¡Empate!'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  tableroContainer: { backgroundColor: '#34495E', padding: 8, borderRadius: 15 },
  fila: { flexDirection: 'row' },
  casilla: {
    width: 90,
    height: 90,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 12,
  },
  textoSimbolo: { fontSize: 50, fontWeight: '900' },
  colorX: { color: '#E74C3C' },
  colorO: { color: '#3498DB' },
  textoTurno: { fontSize: 22, fontWeight: 'bold', color: '#27AE60', marginBottom: 15 },
  textoResultado: { fontSize: 26, fontWeight: 'bold', color: '#E74C3C', marginTop: 20 }
});
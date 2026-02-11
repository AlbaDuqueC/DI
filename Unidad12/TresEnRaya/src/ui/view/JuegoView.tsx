import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Modal } from 'react-native';
import { Juego } from '../../domain/entities/Juego';
import { EstadoJuego, SimboloJugador } from '../../core/Type';

interface JuegoViewProps {
  juego: Juego | null;
  onCasillaTocada: (fila: number, columna: number) => void;
  onReiniciar: () => void;
  actualizacion: number;
  miSimbolo: string | null;
}

const { width } = Dimensions.get('window');
const CELL = width * 0.22;

export const JuegoView: React.FC<JuegoViewProps> = ({ 
  juego, 
  onCasillaTocada, 
  onReiniciar,
  actualizacion,
  miSimbolo 
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const datosJuego = useMemo(() => {
    if (!juego) return null;
    
    return {
      tablero: juego.tablero,
      jugadores: juego.jugadores,
      estado: juego.estado,
      ganador: juego.ganador
    };
  }, [juego, actualizacion]);

  useEffect(() => {
    if (datosJuego?.estado === EstadoJuego.Finalizado) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [datosJuego?.estado, actualizacion]);

  if (!juego || !datosJuego) return null;

  const normalizarSimbolo = (valor: any): string => {
    if (valor === null || valor === undefined) return '';
    if (valor === SimboloJugador.X || valor === 'X') return 'X';
    if (valor === SimboloJugador.O || valor === 'O') return 'O';
    return String(valor).toUpperCase();
  };

  const esFinalizado = datosJuego.estado === EstadoJuego.Finalizado;
  
  const jugadorConTurno = datosJuego.jugadores.find(j => j.esTurno);
  const simboloDelTurno = normalizarSimbolo(jugadorConTurno?.simbolo);
  const esMiTurno = simboloDelTurno === normalizarSimbolo(miSimbolo);

  console.log('👀 DEBUG TURNO:', {
    miSimbolo: miSimbolo,
    miSimboloNormalizado: normalizarSimbolo(miSimbolo),
    simboloDelTurno: simboloDelTurno,
    esMiTurno: esMiTurno,
    esFinalizado: esFinalizado,
    jugadores: datosJuego.jugadores.map(j => ({
      simbolo: j.simbolo,
      simboloNormalizado: normalizarSimbolo(j.simbolo),
      esTurno: j.esTurno
    }))
  });

  const config = useMemo(() => {
    if (datosJuego.ganador) {
      const ganeYo = normalizarSimbolo(datosJuego.ganador.simbolo) === normalizarSimbolo(miSimbolo);
      return ganeYo 
        ? { 
            t: '¡HAS GANADO!', 
            c: '#F06292', 
            img: 'https://i.pinimg.com/originals/64/a7/4f/64a74f9a30a045e0bdf88cbcece05f6d.gif', 
            f: '¡Ole OLE OLE! 🏆', 
            bg: '#FCE4EC' 
          }
        : { 
            t: 'HAS PERDIDO', 
            c: '#9575CD', 
            img: 'https://hips.hearstapps.com/elle-es/assets/18/08/1519130112-giphy-14.gif', 
            f: 'El gato no está impresionado... 😿', 
            bg: '#EDE7F6' 
          };
    }
    return { 
      t: '¡EMPATE!', 
      c: '#BA68C8', 
      img: 'https://i.pinimg.com/originals/d3/7a/a9/d37aa9fdb40615f0f6d95e358c95ed36.gif', 
      f: 'Nadie ganó esta vez. ☁️', 
      bg: '#F3E5F5' 
    };
  }, [datosJuego.ganador, miSimbolo, actualizacion]);

  return (
    <View style={styles.container}>
      <View style={styles.badgeTurno}>
        <Text style={styles.textoTurno}>
          {esFinalizado 
            ? "PARTIDA TERMINADA" 
            : esMiTurno 
              ? "⭐ TU TURNO" 
              : `ESPERANDO A: ${simboloDelTurno || '...'}`}
        </Text>
      </View>

      <View style={styles.tableroContainer}>
        {datosJuego.tablero.map((filaArr, fila) => (
          <View key={fila} style={styles.fila}>
            {filaArr.map((valor, columna) => {
              const valorTxt = normalizarSimbolo(valor);
              return (
                <TouchableOpacity
                  key={`${fila}-${columna}`}
                  style={styles.casilla}
                  onPress={() => {
                    console.log('🎯 Click en casilla:', { 
                      fila, 
                      columna, 
                      esMiTurno, 
                      esFinalizado, 
                      valor,
                      miSimbolo,
                      simboloDelTurno
                    });
                    
                    if (esFinalizado) {
                      console.log('❌ Juego finalizado');
                      return;
                    }
                    if (valor !== null) {
                      console.log('❌ Casilla ocupada');
                      return;
                    }
                    if (!esMiTurno) {
                      console.log('❌ No es mi turno');
                      return;
                    }
                    
                    console.log('✅ Movimiento permitido, llamando onCasillaTocada');
                    onCasillaTocada(fila, columna);
                  }}
                >
                  <Text style={[
                    styles.textoSimbolo, 
                    valorTxt === 'X' ? styles.colorX : styles.colorO
                  ]}>
                    {valorTxt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modal, { borderColor: config.c, backgroundColor: config.bg }]}>
            <Text style={[styles.resTitulo, { color: config.c }]}>{config.t}</Text>
            <Image source={{ uri: config.img }} style={styles.gatoImage} />
            <Text style={styles.frase}>{config.f}</Text>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: config.c }]} 
              onPress={() => {
                setModalVisible(false);
                onReiniciar();
              }}
            >
              <Text style={styles.btnText}>¡REINTENTAR!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  badgeTurno: { 
    marginBottom: 15, 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: 'white', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  textoTurno: { 
    fontWeight: '900', 
    color: '#6A1B9A', 
    fontSize: 14 
  },
  tableroContainer: { 
    backgroundColor: '#F8BBD0', 
    padding: 10, 
    borderRadius: 25 
  },
  fila: { 
    flexDirection: 'row' 
  },
  casilla: { 
    width: CELL, 
    height: CELL, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 5, 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  textoSimbolo: { 
    fontSize: 45, 
    fontWeight: '900' 
  },
  colorX: { 
    color: '#F06292' 
  },
  colorO: { 
    color: '#BA68C8' 
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modal: { 
    width: '85%', 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center', 
    borderWidth: 6 
  },
  resTitulo: { 
    fontSize: 30, 
    fontWeight: '900', 
    marginBottom: 15 
  },
  gatoImage: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    marginBottom: 15 
  },
  frase: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#4A148C', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  btn: { 
    paddingHorizontal: 35, 
    paddingVertical: 12, 
    borderRadius: 15 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});
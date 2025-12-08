import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Temporizador = () => {
  const [segundos, setSegundos] = useState(60);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (activo && segundos > 0) {
      intervalo = setInterval(() => {
        setSegundos((segundos) => segundos - 1);
      }, 1000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [activo, segundos]);

  const alternarInicioPausa = () => {
    setActivo((activo) => !activo);
  };

  const reiniciarTemporizador = () => {
    setSegundos(60);
    setActivo(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{segundos}s</Text>

      <TouchableOpacity style={styles.button} onPress={alternarInicioPausa}>
        <Text style={styles.buttonText}>{activo ? "Pausa" : "Iniciar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={reiniciarTemporizador}>
        <Text style={styles.buttonText}>Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});


export default Temporizador;
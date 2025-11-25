import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function Bienvenida() {
  return (
    <ImageBackground
      source={{
        uri: 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg'
      }}
      style={styles.fondo}
      imageStyle={styles.imagenFondo}
    >
      <View style={styles.overlay}>
        <Text style={styles.titulo}>¡Bienvenido!</Text>

        <Text style={styles.subtitulo}>
          Nos alegra tenerte aquí.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imagenFondo: {
    
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 0,
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 30,
    borderRadius: 20,
  },

  titulo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

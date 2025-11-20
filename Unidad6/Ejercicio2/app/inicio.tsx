import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function Bienvenida() {
  return (
    <ImageBackground
      source={{
        uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.pinterest.com%2Fnerlexx0701%2Fpedazo-de-gato-tonto%2F&psig=AOvVaw3PMv-SyWuK818m3qczo3mR&ust=1763728482152000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDAsOjegJEDFQAAAAAdAAAAABAE"
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
    resizeMode: "cover",
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

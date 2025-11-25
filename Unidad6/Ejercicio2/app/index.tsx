import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

import { Ionicons } from '@expo/vector-icons';
import Boton from "@/components/Boton";

export default function Index() {

  const router = useRouter();

  const goToRegister = () => {
    router.push('/register');
  };
  const goToInicio = () => {
    router.push('/inicio');
  }

  return (

    <ImageBackground
      source={{
        uri: 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg'
      }}
      
      style={styles.fondo}>
    
    <View style={styles.contenedor}>
      
      {/* Contenedor blanco inferior */}
      <View style={styles.cajaBlanca}>
        
        {/* Título */}
        <Text style={styles.titulo}>Ingresar</Text>

        {/* Input usuario */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-circle-outline" size={28} color="#8d0057ff" />
          <TextInput 
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#999"
            editable={false} // NO debe hacer nada
          />
        </View>

        {/* Input contraseña */}
        <View style={styles.inputContainer}>
          <Ionicons name="eye-outline" size={28} color="#8d0057ff" />
          <TextInput 
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            editable={false} // NO debe hacer nada
          />
        </View>

        {/* Botón (NO TOCAR) */}
        <Boton title="Entrar" onPress={goToInicio} />

        {/* Texto inferior */}
        <Text style={styles.textoRegistro}>
          ¿No tienes cuenta?{" "}
          <Text style={styles.registrate} onPress={goToRegister}>
            Regístrate
          </Text>
        </Text>

      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundImage: "#e7b3daff",
    justifyContent: "flex-end",
  },

  cajaBlanca: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 25,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  textoRegistro: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },

  registrate: {
    color: "#8d0057ff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  fondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 0,
  },
});


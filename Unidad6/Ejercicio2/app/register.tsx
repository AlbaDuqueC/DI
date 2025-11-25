 import Boton from "@/components/Boton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ImageBackground, TextInput } from "react-native";
 
 export default function Bienvenida() {

    const router = useRouter();
    
      
      const goToInicio = () => {
        router.push('/inicio');
      }


  return (
  <ImageBackground
      source={{
        uri: 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg'
      }}
      style={styles.fondo}
      imageStyle={styles.fondo}



      

    >

        <View style={styles.contenedor}>
      
      {/* Contenedor blanco inferior */}
      <View style={styles.cajaBlanca}>
        
        {/* Título */}
        <Text style={styles.titulo}>Registrar</Text>

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
        <Boton title="Registrarse" onPress={goToInicio} />

        

      </View>
    </View>
    </ImageBackground>


);}

const styles = StyleSheet.create({
    contenedor: {
    flex: 1,
    backgroundImage: "#e7b3daff",
    justifyContent: "flex-start",
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
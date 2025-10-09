import { Text, View , StyleSheet} from "react-native";
import { FlatList } from "react-native-gesture-handler";



const personas = [
  { id: 1, nombre: "Juan", apellido: "Pérez" },
  { id: 2, nombre: "María", apellido: "Gómez" },
  { id: 3, nombre: "Luis", apellido: "Ramírez" },
  { id: 4, nombre: "Ana", apellido: "Martínez" },
  { id: 5, nombre: "Carlos", apellido: "Fernández" },
  { id: 6, nombre: "Lucía", apellido: "Rodríguez" },
  { id: 7, nombre: "Pedro", apellido: "López" },
  { id: 8, nombre: "Sofía", apellido: "García" },
  { id: 9, nombre: "Diego", apellido: "Sánchez" },
  { id: 10, nombre: "Valentina", apellido: "Torres" },
  { id: 11, nombre: "Andrés", apellido: "Castro" },
  { id: 12, nombre: "Camila", apellido: "Vargas" },
  { id: 13, nombre: "Javier", apellido: "Mendoza" },
  { id: 14, nombre: "Paula", apellido: "Ortega" },
  { id: 15, nombre: "Martín", apellido: "Reyes" }
];

export default function Index() {
  return (
    <FlatList     
    data={personas}
    keyExtractor={(item) => item.id.toString()}
    renderItem = {({item}) => (

      <View style={styles.items}>

          <Text style={styles.container}>{item.nombre}{item.apellido}</Text>

      </View>

    )}
    
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
     alignItems: "center",
     fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  items: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 3,
  },

});

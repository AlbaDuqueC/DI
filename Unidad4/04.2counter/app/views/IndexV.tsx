import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { RepositoryPersona } from "../models/data/RepositoryPersona";

export default class IndexV extends React.Component {
  state = {
    selectedId: null, 
  };

  toggleDetails = (id:number) => {
    this.setState((selectedId) => ({
      selectedId: selectedId === id ? null : id, 
    }));
  };

  render() {
    const personas = RepositoryPersona.getPersona();
    const { selectedId } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={personas}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.toggleDetails(item.id)}>
              <View style={styles.item}>
                <Text style={styles.text}>
                  {item.nombre} {item.apellido} { selectedId === item.id ? "▲" : "▼" }
                </Text>
                
                {selectedId === item.id && (
                  <View style={styles.datos}>
                    <Text>ID: {item.id}</Text>
                    <Text>Nombre: {item.nombre}</Text>
                    <Text>Apellido: {item.apellido}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#ffd2ecff",
  },
  item: {
    backgroundColor: "#fff5f9ff",
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Sombra Android
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#6b096bff",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
  id: {
    fontSize: 15,
    color: "#794573ff",
  },
  datos: {
    marginTop: 10,
    backgroundColor: "#f8c6ebff",
    padding: 10,
    borderRadius: 5,
  },
});
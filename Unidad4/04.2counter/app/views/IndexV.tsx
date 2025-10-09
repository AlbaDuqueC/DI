import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import {RepositoryPersona} from "../models/data/RepositoryPersona"

export default class IndexV extends React.Component {
  render() {
    const personas = RepositoryPersona.getPersona();

    return (
      <View style={styles.container}>
        <FlatList
          data={personas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>{item.nombre} {item.apellido}</Text>
              <Text style={styles.id}>ID: {item.id}</Text>
            </View>
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
    backgroundColor: "#ffeff5ff",
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
  }
});
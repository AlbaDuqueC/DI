import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const listaFAB = () => {
  const listaRef = useRef<FlatList<string>>(null);
  const [mostrarBoton, setMostrarBoton] = useState(false);

  const datos = Array.from({ length: 50 }, (_, i) => `Elemento ${i + 1}`);

  const manejarScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setMostrarBoton(offsetY > 300);
  };

  const irArriba = () => {
    listaRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listaRef}
        data={datos}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        onScroll={manejarScroll}
        scrollEventThrottle={16}
      />

      {mostrarBoton && (
        <TouchableOpacity style={styles.fab} onPress={irArriba}>
          <Text style={styles.fabText}>↑</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 18,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});

export default listaFAB;
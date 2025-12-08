import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";

const ListaConFAB = () => {
  const listaRef = useRef<FlatList<string>>(null);
  const [mostrarBoton, setMostrarBoton] = useState(false);

  // Animación: posición y opacidad
  const translateY = useRef(new Animated.Value(100)).current; // empieza fuera de la pantalla
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const datos = Array.from({ length: 100 }, (_, i) => `Elemento ${i + 1}`);

  const manejarScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const shouldShow = offsetY > 300;

    if (shouldShow !== mostrarBoton) {
      setMostrarBoton(shouldShow);
    }
  };

  useEffect(() => {
    // Animación combinada: opacidad y posición
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: mostrarBoton ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: mostrarBoton ? 0 : 100, // 0 = visible, 100 = fuera de la pantalla
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mostrarBoton]);

  const irArriba = () => {
    listaRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listaRef}
        data={datos}
        keyExtractor={(item) => item.replace("Elemento ", "")}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        onScroll={manejarScroll}
        scrollEventThrottle={16}
      />

      {/* FAB siempre renderizado; animación de opacidad + deslizamiento */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateY }],
          },
        ]}
      >
        <TouchableOpacity style={styles.fab} onPress={irArriba}>
          <Text style={styles.fabText}>↑</Text>
        </TouchableOpacity>
      </Animated.View>
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
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  fab: {
    backgroundColor: "#007AFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});

export default ListaConFAB;

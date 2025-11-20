import TarjetaProducto from "./components/TarjetaProducto";
import React  from "react";
import { useState } from "react";
import { ImageSourcePropType, StatusBar, TouchableOpacity, Text, FlatList, StyleSheet, View } from "react-native";


/* Reemplaza los require(...) por tus assets locales o URIs remotas según prefieras */
const PRODUCTS: { id: string; name: string; price: number; image: ImageSourcePropType }[] = [
  { id: "p1", name: "Gato", price: 79.99, image: require("../assets/images/gato.jpg") },
  { id: "p2", name: "Compact Dron", price: 349.99, image: require("") },
  { id: "p3", name: "Gaming", price: 129.99, image: require("") },
  { id: "p4", name: "Smartwatch X", price: 185.99, image: require("") },
];

export default function App() {
  const [cartCount, setCartCount] = useState<number>(0);

  function handleAddToCart() {
    setCartCount((c) => c + 1);
  }

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Nuestros Productos</Text>

        <TouchableOpacity style={styles.cartWrap} accessibilityLabel="Ver carrito">
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        horizontal={false}
        numColumns={2}
        renderItem={({ item }) => (
          <TarjetaProducto
            name={item.name}
            price={item.price}
            Image={item.image}
            onAddToCart={handleAddToCart}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  cartWrap: {
    padding: 6,
  },
  cartIcon: {
    fontSize: 24,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: -6,
    backgroundColor: "#EF4444",
    borderRadius: 999,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    alignItems: "center",
  },
});


import React from "react";
import { ImageSourcePropType, Image, Text, StyleSheet, View } from "react-native";
import BotonPersonalizado from "./BotonPersona";

export interface TarjetaProductoProps {
  name: string;
  price: number;
  Image: ImageSourcePropType;
  onAddToCart: () => void;
}

export default function TarjetaProducto({ name, price, Image: ImgSource, onAddToCart }: TarjetaProductoProps) {
  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={ImgSource} style={[styles.image, ]} resizeMode="contain" />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name]} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>

      <View style={styles.action}>
        <BotonPersonalizado onPress={onAddToCart} accessibilityLabel={`Añadir ${name} al carrito`}>
          Añadir al Carrito
        </BotonPersonalizado>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 6,
    width: 260,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrap: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  action: {
    alignItems: "flex-end",
  },
});



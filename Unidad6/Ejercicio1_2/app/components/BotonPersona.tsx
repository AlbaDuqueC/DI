import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from "react-native";

interface BotonPersonalizadoProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
}

export default function BotonPersonalizado({
  children,
  onPress,
  accessibilityLabel,
}: BotonPersonalizadoProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button]}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.8}
    >
      <Text 
      style= {styles.text} 
      >
        {children}
      
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});


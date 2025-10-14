// src/Components/CustomButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

// Definimos los tipos para las props
interface CustomButtonProps {
  text: string; // El texto que mostrará el botón
}

const CustomButton: React.FC<CustomButtonProps> = ({ text }) => {
  return (
    <Pressable style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomButton;

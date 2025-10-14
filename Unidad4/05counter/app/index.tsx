// src/Index.tsx
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

const Index: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomButton text="Botón 1: Información" />
      <CustomButton text="Botón 2: Acción" />
      <CustomButton text="Botón 3: Confirmar" />
      <CustomButton text="Botón 4: Cancelar" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Index;


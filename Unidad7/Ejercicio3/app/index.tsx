import { registerRootComponent } from 'expo';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ListaConFAB from './componentes/listaConFAB';

export default function Index() {
  return (
    <View style={styles.container}>
      <ListaConFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

registerRootComponent(Index);

// src/App.tsx
import React, { useState } from 'react';
import {View, Text, Pressable, ActivityIndicator, StyleSheet} from 'react-native';


const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleReload = () => {
    setLoading(true);
    setLoaded(false);

    // Simular una carga de 2 segundos
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleReload}>

        <Text style={styles.buttonText}>Recargar</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {!loading && loaded && (
        <Text style={styles.successText}>Cargado con éxito</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 16,
    color: '#007AFF',
  },
  successText: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
});

export default App;

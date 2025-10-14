// src/App.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const App: React.FC = () => {
  // Estado para almacenar el texto ingresado por el usuario
  const [inputText, setInputText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Escribe algo aquí..."
        value={inputText} // Enlazamos el valor del TextInput con el estado
        onChangeText={(text) => setInputText(text)} // Actualizamos el estado con el texto ingresado
      />
      <Text style={styles.text}>Texto ingresado: {inputText}</Text>
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
  textInput: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;

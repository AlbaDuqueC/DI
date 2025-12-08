import React, { useReducer, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Estado, Accion, Tarea } from './interfaz/tipos';
import TareaItem from './componentes/TareaItem';

// Estado inicial
const estadoInicial: Estado = [
  { id: Date.now(), texto: 'Ejemplo de tarea', completada: false },
];

// Reducer
function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.type) {
    case 'AGREGAR':
      const nuevaTarea: Tarea = {
        id: Date.now(),
        texto: accion.payload.texto,
        completada: false,
      };
      return [...estado, nuevaTarea];

    case 'TOGGLE':
      return estado.map(t =>
        t.id === accion.payload.id ? { ...t, completada: !t.completada } : t
      );

    case 'ELIMINAR':
      return estado.filter(t => t.id !== accion.payload.id);

    default:
      return estado;
  }
}

const ListaDeTareasApp = () => {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);
  const [texto, setTexto] = useState('');

  const agregarTarea = () => {
    if (texto.trim() === '') return;
    dispatch({ type: 'AGREGAR', payload: { texto } });
    setTexto('');
  };

  const toggleTarea = (id: number) => dispatch({ type: 'TOGGLE', payload: { id } });
  const eliminarTarea = (id: number) => dispatch({ type: 'ELIMINAR', payload: { id } });

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Lista de Tareas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nueva tarea"
          value={texto}
          onChangeText={setTexto}
        />
        <Button title="Agregar" onPress={agregarTarea} />
      </View>
      <FlatList
        data={estado}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TareaItem
            tarea={item}
            onToggle={toggleTarea}
            onEliminar={eliminarTarea}
          />
        )}
        ListEmptyComponent={<Text>No hay tareas aún</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default ListaDeTareasApp;

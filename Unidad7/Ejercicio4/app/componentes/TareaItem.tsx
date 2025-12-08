import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Tarea } from '../interfaz/tipos';

interface Props {
  tarea: Tarea;
  onToggle: (id: number) => void;
  onEliminar: (id: number) => void;
}

const TareaItem: React.FC<Props> = ({ tarea, onToggle, onEliminar }) => {
  return (
    <View style={styles.contenedor}>
      <Text style={[styles.texto, tarea.completada && styles.completada]}>
        {tarea.texto}
      </Text>
      <View style={styles.botones}>
        <Button
          title={tarea.completada ? 'Deshacer' : 'Completar'}
          onPress={() => onToggle(tarea.id)}
        />
        <Button
          title="Eliminar"
          color="red"
          onPress={() => onEliminar(tarea.id)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },
  texto: {
    fontSize: 16,
  },
  completada: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  botones: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
});

export default TareaItem;

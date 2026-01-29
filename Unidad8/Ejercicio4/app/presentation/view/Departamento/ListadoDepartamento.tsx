// src/presentation/screens/departamentos/ListadoDepartamentos.tsx

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { container } from '../../../core/Container';
import { TYPES } from '../../../core/types';
import { DepartamentosVM } from '../../viewModel/DepartamentoVM';

// Componente funcional envuelto con observer para reactividad de MobX
const ListadoDepartamentosScreen: React.FC = observer(() => {
  // Hook para acceder al objeto navigation de React Navigation
  const navigation = useNavigation();
  // Obtiene la instancia del ViewModel desde el contenedor de dependencias
  const viewModel = container.get<DepartamentosVM>(TYPES.DepartamentosVM);

  // Hook useEffect que se ejecuta al montar el componente
  useEffect(() => {
    // Carga la lista de departamentos al inicio
    viewModel.cargarDepartamentos();
  }, []); // Array vacío significa que solo se ejecuta una vez al montar

  // Función que maneja la eliminación de un departamento
  const handleEliminar = (id: number, nombre: string) => {
    // Muestra un diálogo de confirmación antes de eliminar
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar el departamento "${nombre}"?`,
      [
        // Botón para cancelar la acción
        { text: 'Cancelar', style: 'cancel' },
        {
          // Botón para confirmar la eliminación
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Llama al método del ViewModel para eliminar
              await viewModel.eliminarDepartamento(id);
              // Muestra mensaje de éxito
              Alert.alert('Éxito', 'Departamento eliminado correctamente');
            } catch (error) {
              // Muestra mensaje de error si falla
              Alert.alert('Error', error instanceof Error ? error.message : 'Error al eliminar');
            }
          },
        },
      ]
    );
  };

  // Función que maneja la edición de un departamento
  const handleEditar = (departamento: any) => {
    // Establece el departamento seleccionado en el ViewModel
    viewModel.setDepartamentoSeleccionado(departamento);
    // Convierte navigation a any para evitar errores de TypeScript
    (navigation as any).navigate('EditarInsertarDepartamento', { 
      // Pasa el ID como parámetro de navegación
      departamentoId: departamento.id 
    });
  };

  // Si está cargando y no hay departamentos, muestra indicador de carga
  if (viewModel.isLoading && viewModel.departamentos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando departamentos...</Text>
      </View>
    );
  }

  // Renderiza la interfaz principal
  return (
    <View style={styles.container}>
      {/* Contenedor de la barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar departamento..."
          value={viewModel.filtro}
          // Actualiza el filtro en el ViewModel al escribir
          onChangeText={(text) => viewModel.setFiltro(text)}
        />
      </View>

      {/* Muestra mensaje de error si existe */}
      {viewModel.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{viewModel.error}</Text>
        </View>
      )}

      {/* Lista de departamentos */}
      <FlatList
        // Fuente de datos filtrada
        data={viewModel.departamentos}
        // Función que genera keys únicas para cada item
        keyExtractor={(item) => item.id.toString()}
        // Función que renderiza cada item de la lista
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Sección de contenido del departamento */}
            <View style={styles.cardContent}>
              {/* Contenedor del icono */}
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🏢</Text>
              </View>
              {/* Contenedor de la información */}
              <View style={styles.infoContainer}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.id}>ID: {item.id}</Text>
              </View>
            </View>
            
            {/* Fila de botones de acción */}
            <View style={styles.buttonRow}>
              {/* Botón para editar */}
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => handleEditar(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              
              {/* Botón para eliminar */}
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleEliminar(item.id, item.nombre)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        // Componente que se muestra cuando la lista está vacía
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay departamentos registrados</Text>
          </View>
        )}
      />

      {/* Botón flotante (FAB) para crear nuevo departamento */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NuevoDepartamento' as never)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

// Objeto StyleSheet con todos los estilos del componente
const styles = StyleSheet.create({
  // Estilo del contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Estilo para centrar contenido
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  // Estilo del texto de carga
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  // Estilo del contenedor de búsqueda
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  // Estilo del input de búsqueda
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  // Estilo del contenedor de errores
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  // Estilo del texto de error
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  // Estilo de cada tarjeta de departamento
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  // Estilo del contenido de la tarjeta
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Estilo del contenedor del icono
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#E3F2FD',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  // Estilo del icono
  icon: {
    fontSize: 30,
  },
  // Estilo del contenedor de información
  infoContainer: {
    flex: 1,
  },
  // Estilo del nombre del departamento
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  // Estilo del ID del departamento
  id: {
    fontSize: 14,
    color: '#666',
  },
  // Estilo de la fila de botones
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  // Estilo base de los botones
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  // Estilo del botón de editar (verde)
  editButton: {
    backgroundColor: '#4CAF50',
  },
  // Estilo del botón de eliminar (rojo)
  deleteButton: {
    backgroundColor: '#F44336',
  },
  // Estilo del texto de los botones
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Estilo del contenedor cuando la lista está vacía
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  // Estilo del texto cuando la lista está vacía
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  // Estilo del botón flotante (FAB)
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  // Estilo del texto del FAB
  fabText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});

// Exporta el componente como default
export default ListadoDepartamentosScreen;
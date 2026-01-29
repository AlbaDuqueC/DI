// app/presentation/view/Persona/ListadoPersonas.tsx

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { container } from '../../../core/Container';
import { TYPES } from '../../../core/types';
import { PersonasVM } from '../../viewModel/PersonaVM';

// Componente funcional envuelto con observer para reactividad de MobX
const ListadoPersonasScreen: React.FC = observer(() => {
  // Hook para acceder al objeto router de expo-router
  const router = useRouter();
  // Obtiene la instancia del ViewModel desde el contenedor de dependencias
  const viewModel = container.get<PersonasVM>(TYPES.PersonasVM);

  // Hook useEffect que se ejecuta al montar el componente
  useEffect(() => {
    // Log de inicio de carga para debugging
    console.log('ListadoPersonas: Iniciando carga de personas...');
    // Carga la lista de personas al inicio
    viewModel.cargarPersonas();
  }, []); // Array vacío: solo se ejecuta una vez al montar

  // Hook useEffect que registra cambios en el estado del ViewModel
  useEffect(() => {
    // Log del estado actual para debugging
    console.log('Estado del ViewModel:', {
      isLoading: viewModel.isLoading,
      error: viewModel.error,
      personasCount: viewModel.personas.length,
      personas: viewModel.personas
    });
  }, [viewModel.isLoading, viewModel.error, viewModel.personas.length]); // Se ejecuta cuando cambian estas propiedades

  // Función que maneja la eliminación de una persona
  const handleEliminar = (id: number, nombre: string) => {
    // Muestra diálogo de confirmación
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar a ${nombre}?`,
      [
        // Botón para cancelar
        { text: 'Cancelar', style: 'cancel' },
        {
          // Botón para confirmar eliminación
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Llama al método del ViewModel para eliminar
              await viewModel.eliminarPersona(id);
              // Muestra mensaje de éxito
              Alert.alert('Éxito', 'Persona eliminada correctamente');
            } catch (error) {
              // Muestra mensaje de error si falla
              Alert.alert('Error', error instanceof Error ? error.message : 'Error al eliminar');
            }
          },
        },
      ]
    );
  };

  // Función que maneja la edición de una persona
  const handleEditar = (persona: any) => {
    // Establece la persona seleccionada en el ViewModel
    viewModel.setPersonaSeleccionada(persona);
    // Navega a la pantalla de edición pasando el ID como parámetro
    router.push({
      pathname: '/presentation/view/Persona/EditarInsertarPersonas',
      params: { personaId: persona.id.toString() }
    });
  };

  // Si está cargando y no hay personas, muestra indicador de carga
  if (viewModel.isLoading && viewModel.personas.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando personas...</Text>
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
          placeholder="Buscar persona..."
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

      {/* Lista de personas */}
      <FlatList
        // Fuente de datos filtrada
        data={viewModel.personas}
        // Función que genera keys únicas para cada item con validación defensiva
        keyExtractor={(item, index) => {
          // Verifica si el item es undefined
          if (!item) {
            console.error('❌ Item undefined en posición:', index);
            return `error-${index}`;
          }
          // Verifica si el item tiene un ID válido
          if (item.id === undefined || item.id === null) {
            console.error('❌ Item sin ID válido:', item, 'en posición:', index);
            return `no-id-${index}`;
          }
          // Retorna el ID convertido a string
          return item.id.toString();
        }}
        // Función que renderiza cada item de la lista
        renderItem={({ item, index }) => {
          // Validación defensiva: verifica que el item existe
          if (!item) {
            console.error('❌ Intentando renderizar item undefined en posición:', index);
            return null;
          }

          // Validación defensiva: verifica que el item tiene ID
          if (!item.id) {
            console.error('❌ Item sin ID:', item);
            return null;
          }

          // Log de éxito al renderizar
          console.log('✅ Renderizando persona:', {
            id: item.id,
            nombre: item.nombreCompleto,
            edad: item.edad
          });

          // Renderiza la tarjeta de la persona
          return (
            <View style={styles.card}>
              {/* Encabezado de la tarjeta con nombre y edad */}
              <View style={styles.cardHeader}>
                <Text style={styles.nombre}>{item.nombreCompleto || 'Sin nombre'}</Text>
                <Text style={styles.edad}>{item.edad || '?'} años</Text>
              </View>
              
              {/* Detalles de la persona */}
              <Text style={styles.detalle}>📞 {item.telefono || 'Sin teléfono'}</Text>
              <Text style={styles.detalle}>📍 {item.direccion || 'Sin dirección'}</Text>
              <Text style={styles.detalle}>🎂 {item.fechaNacimiento || 'Sin fecha'}</Text>
              
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
                  onPress={() => handleEliminar(item.id, item.nombreCompleto)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        // Componente que se muestra cuando la lista está vacía
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {/* Mensaje diferente si está cargando o si realmente no hay datos */}
              {viewModel.isLoading ? 'Cargando...' : 'No hay personas registradas'}
            </Text>
          </View>
        )}
      />

      {/* Botón flotante (FAB) para crear nueva persona */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/presentation/view/Persona/EditarInsertarPersonas')}
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
  // Estilo de cada tarjeta de persona
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  // Estilo del encabezado de la tarjeta
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Estilo del nombre de la persona
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  // Estilo de la edad
  edad: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  // Estilo de cada línea de detalle
  detalle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
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
export default ListadoPersonasScreen;
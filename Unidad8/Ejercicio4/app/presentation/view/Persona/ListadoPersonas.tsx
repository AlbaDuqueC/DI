// app/presentation/view/Persona/ListadoPersonas.tsx

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { container } from '../../../core/Container';
import { TYPES } from '../../../core/types';
import { PersonasVM } from '../../viewModel/PersonaVM';

const ListadoPersonasScreen: React.FC = observer(() => {
  const router = useRouter();
  const viewModel = container.get<PersonasVM>(TYPES.PersonasVM);

  useEffect(() => {
    console.log('🔄 ListadoPersonas: Iniciando carga de personas...');
    viewModel.cargarPersonas();
  }, []);

  // ✅ Log para verificar el estado del viewModel
  useEffect(() => {
    console.log('📊 Estado del ViewModel:', {
      isLoading: viewModel.isLoading,
      error: viewModel.error,
      personasCount: viewModel.personas.length,
      personas: viewModel.personas
    });
  }, [viewModel.isLoading, viewModel.error, viewModel.personas.length]);

  const handleEliminar = (id: number, nombre: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await viewModel.eliminarPersona(id);
              Alert.alert('Éxito', 'Persona eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Error al eliminar');
            }
          },
        },
      ]
    );
  };

  const handleEditar = (persona: any) => {
    viewModel.setPersonaSeleccionada(persona);
    router.push({
      pathname: '/presentation/view/Persona/EditarInsertarPersonas',
      params: { personaId: persona.id.toString() }
    });
  };

  if (viewModel.isLoading && viewModel.personas.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando personas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar persona..."
          value={viewModel.filtro}
          onChangeText={(text) => viewModel.setFiltro(text)}
        />
      </View>

      {viewModel.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{viewModel.error}</Text>
        </View>
      )}

      <FlatList
        data={viewModel.personas}
        keyExtractor={(item, index) => {
          // ✅ Validación defensiva mejorada
          if (!item) {
            console.error('❌ Item undefined en posición:', index);
            return `error-${index}`;
          }
          if (item.id === undefined || item.id === null) {
            console.error('❌ Item sin ID válido:', item, 'en posición:', index);
            return `no-id-${index}`;
          }
          return item.id.toString();
        }}
        renderItem={({ item, index }) => {
          // ✅ Validación defensiva
          if (!item) {
            console.error('❌ Intentando renderizar item undefined en posición:', index);
            return null;
          }

          if (!item.id) {
            console.error('❌ Item sin ID:', item);
            return null;
          }

          console.log('✅ Renderizando persona:', {
            id: item.id,
            nombre: item.nombreCompleto,
            edad: item.edad
          });

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.nombre}>{item.nombreCompleto || 'Sin nombre'}</Text>
                <Text style={styles.edad}>{item.edad || '?'} años</Text>
              </View>
              
              <Text style={styles.detalle}>📞 {item.telefono || 'Sin teléfono'}</Text>
              <Text style={styles.detalle}>📍 {item.direccion || 'Sin dirección'}</Text>
              <Text style={styles.detalle}>🎂 {item.fechaNacimiento || 'Sin fecha'}</Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => handleEditar(item)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {viewModel.isLoading ? 'Cargando...' : 'No hay personas registradas'}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/presentation/view/Persona/EditarInsertarPersonas')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  edad: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  detalle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
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
  fabText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListadoPersonasScreen;
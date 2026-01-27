import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // ✅ Cambios aquí
import { observer } from 'mobx-react-lite';
import { container } from '../../../core/Container';
import { TYPES } from '../../../core/types';
import { EditarInsertarDepartamentoVM } from '../../viewModel/EditarInsertarDepartamento';

const EditarInsertarDepartamentoScreen: React.FC = observer(() => {
  const router = useRouter(); // ✅ Cambio aquí
  const params = useLocalSearchParams(); // ✅ Cambio aquí
  
  const [viewModel] = useState(() => container.get<EditarInsertarDepartamentoVM>(TYPES.EditarInsertarDepartamentoVM));

  useEffect(() => {
    if (params?.departamentoId) {
      viewModel.cargarDepartamento(Number(params.departamentoId));
    } else {
      viewModel.limpiarFormulario();
    }

    return () => {
      viewModel.limpiarFormulario();
    };
  }, [params?.departamentoId]);

  const handleGuardar = async () => {
    try {
      await viewModel.guardarDepartamento();
      Alert.alert(
        'Éxito',
        viewModel.isEditMode ? 'Departamento actualizado correctamente' : 'Departamento creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back(), // ✅ Cambio aquí
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al guardar');
    }
  };

  if (viewModel.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏢</Text>
        </View>

        <Text style={styles.label}>Nombre del Departamento *</Text>
        <TextInput
          style={styles.input}
          value={viewModel.nombre}
          onChangeText={(text) => viewModel.setNombre(text)}
          placeholder="Ingrese el nombre del departamento"
          autoFocus
        />

        {viewModel.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{viewModel.error}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {viewModel.isEditMode 
              ? '✏️ Está editando un departamento existente' 
              : '➕ Está creando un nuevo departamento'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleGuardar}
            disabled={viewModel.isLoading}
          >
            <Text style={styles.buttonText}>
              {viewModel.isEditMode ? '💾 Actualizar' : '💾 Guardar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()} // ✅ Cambio aquí
          >
            <Text style={styles.buttonText}>❌ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  },
  form: {
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#E3F2FD',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditarInsertarDepartamentoScreen;
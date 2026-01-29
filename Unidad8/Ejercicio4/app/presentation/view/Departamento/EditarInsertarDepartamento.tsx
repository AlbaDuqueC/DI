import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { observer } from 'mobx-react-lite';
import { container } from '../../../core/Container';
import { TYPES } from '../../../core/types';
import { EditarInsertarDepartamentoVM } from '../../viewModel/EditarInsertarDepartamento';

// Componente funcional de React envuelto con observer para hacer reactivo MobX
const EditarInsertarDepartamentoScreen: React.FC = observer(() => {
  // Hook para acceder al objeto router de expo-router para navegación
  const router = useRouter(); 
  // Hook para obtener los parámetros de la URL
  const params = useLocalSearchParams(); 
  
  // Hook useState que crea y mantiene una instancia única del ViewModel
  const [viewModel] = useState(() => container.get<EditarInsertarDepartamentoVM>(TYPES.EditarInsertarDepartamentoVM));

  // Hook useEffect que se ejecuta cuando cambia el parámetro departamentoId
  useEffect(() => {
    // Si existe un ID de departamento en los parámetros
    if (params?.departamentoId) {
      // Carga los datos del departamento para edición
      viewModel.cargarDepartamento(Number(params.departamentoId));
    } else {
      // Si no hay ID, limpia el formulario para modo creación
      viewModel.limpiarFormulario();
    }

    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      // Limpia el formulario al salir de la pantalla
      viewModel.limpiarFormulario();
    };
  }, [params?.departamentoId]); // Dependencias: se ejecuta cuando cambia el ID

  // Función asíncrona que maneja el evento de guardar
  const handleGuardar = async () => {
    try {
      // Llama al método del ViewModel para guardar
      await viewModel.guardarDepartamento();
      // Muestra una alerta de éxito con mensaje diferente según el modo
      Alert.alert(
        'Éxito',
        viewModel.isEditMode ? 'Departamento actualizado correctamente' : 'Departamento creado correctamente',
        [
          {
            text: 'OK',
            // Al presionar OK, navega hacia atrás
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      // Si hay error, muestra una alerta con el mensaje de error
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al guardar');
    }
  };

  // Si está cargando, muestra un indicador de carga centrado
  if (viewModel.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // Renderiza el formulario principal
  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Contenedor del icono decorativo */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏢</Text>
        </View>

        {/* Etiqueta del campo nombre */}
        <Text style={styles.label}>Nombre del Departamento *</Text>
        {/* Input para el nombre del departamento */}
        <TextInput
          style={styles.input}
          value={viewModel.nombre}
          // Actualiza el estado del ViewModel cuando cambia el texto
          onChangeText={(text) => viewModel.setNombre(text)}
          placeholder="Ingrese el nombre del departamento"
          autoFocus
        />

        {/* Muestra el mensaje de error si existe */}
        {viewModel.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{viewModel.error}</Text>
          </View>
        )}

        {/* Caja de información que muestra el modo actual */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {viewModel.isEditMode 
              ? 'Está editando un departamento existente' 
              : 'Está creando un nuevo departamento'}
          </Text>
        </View>

        {/* Contenedor de botones de acción */}
        <View style={styles.buttonContainer}>
          {/* Botón para guardar/actualizar */}
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleGuardar}
            // Deshabilita el botón mientras está cargando
            disabled={viewModel.isLoading}
          >
            <Text style={styles.buttonText}>
              {/* Texto diferente según el modo */}
              {viewModel.isEditMode ? ' Actualizar' : 'Guardar'}
            </Text>
          </TouchableOpacity>

          {/* Botón para cancelar y volver */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()} 
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
});

// Objeto StyleSheet que define todos los estilos del componente
const styles = StyleSheet.create({
  // Estilo para el contenedor principal con scroll
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Estilo para centrar contenido (usado en loading)
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilo para el contenedor del formulario
  form: {
    padding: 20,
  },
  // Estilo para el contenedor circular del icono
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
  // Estilo para el emoji del icono
  icon: {
    fontSize: 50,
  },
  // Estilo para las etiquetas de los campos
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  // Estilo para los campos de entrada de texto
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Estilo para el contenedor de mensajes de error
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  // Estilo para el texto de error
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  // Estilo para la caja de información
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  // Estilo para el texto de información
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
  },
  // Estilo para el contenedor de botones
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  // Estilo base para todos los botones
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Estilo específico para el botón de guardar (verde)
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  // Estilo específico para el botón de cancelar (gris)
  cancelButton: {
    backgroundColor: '#757575',
  },
  // Estilo para el texto de los botones
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Exporta el componente como default para poder importarlo
export default EditarInsertarDepartamentoScreen;
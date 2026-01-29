// app/presentation/view/Persona/EditarInsertarPersonas.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { container } from '../../../core/Container';
import { TYPES } from '../../../core/types';
import { EditarInsertarPersonaVM } from '../../viewModel/EditarInsertarPersona';
import { DepartamentosVM } from '../../viewModel/DepartamentoVM';

// Componente funcional envuelto con observer para reactividad de MobX
const EditarInsertarPersonaScreen: React.FC = observer(() => {
  // Hook para acceder al objeto router de expo-router
  const router = useRouter();
  // Hook para obtener los parámetros de la URL
  const params = useLocalSearchParams();
  
  // Hook useState que crea y mantiene una instancia única del ViewModel de personas
  const [viewModel] = useState(() => container.get<EditarInsertarPersonaVM>(TYPES.EditarInsertarPersonaVM));
  // Obtiene la instancia del ViewModel de departamentos desde el contenedor
  const departamentosVM = container.get<DepartamentosVM>(TYPES.DepartamentosVM);

  // Estado local para manejar la fecha como texto formateado
  const [fechaTexto, setFechaTexto] = useState('');

  // Hook useEffect que se ejecuta cuando cambia el parámetro personaId
  useEffect(() => {
    // Carga la lista de departamentos disponibles
    departamentosVM.cargarDepartamentos();
    
    // Si existe un ID de persona en los parámetros
    if (params?.personaId) {
      // Carga los datos de la persona para edición
      viewModel.cargarPersona(Number(params.personaId));
    } else {
      // Si no hay ID, limpia el formulario para modo creación
      viewModel.limpiarFormulario();
    }

    // Función de limpieza que se ejecuta al desmontar
    return () => {
      // Limpia el formulario al salir de la pantalla
      viewModel.limpiarFormulario();
    };
  }, [params?.personaId]); // Se ejecuta cuando cambia el ID

  // Hook useEffect que formatea la fecha del ViewModel a texto DD/MM/YYYY
  useEffect(() => {
    // Obtiene la fecha del ViewModel
    const fecha = viewModel.fechaNacimiento;
    // Extrae y formatea el día a 2 dígitos
    const dia = fecha.getDate().toString().padStart(2, '0');
    // Extrae y formatea el mes a 2 dígitos (sumando 1 porque los meses van de 0-11)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    // Extrae el año completo
    const anio = fecha.getFullYear();
    // Actualiza el estado con la fecha formateada
    setFechaTexto(`${dia}/${mes}/${anio}`);
  }, [viewModel.fechaNacimiento]); // Se ejecuta cuando cambia la fecha en el ViewModel

  // Función que maneja los cambios en el campo de fecha
  const handleFechaChange = (texto: string) => {
    // Actualiza el texto que ve el usuario
    setFechaTexto(texto);
    
    // Solo intenta parsear cuando el texto tiene longitud completa (DD/MM/YYYY = 10 caracteres)
    if (texto.length === 10) {
      // Divide el texto por el separador '/'
      const partes = texto.split('/');
      // Verifica que tenga exactamente 3 partes (día, mes, año)
      if (partes.length === 3) {
        // Convierte cada parte a número entero
        const dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; // Resta 1 porque Date usa meses de 0-11
        const anio = parseInt(partes[2]);
        
        // Verifica que todos los valores sean números válidos
        if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
          // Crea un objeto Date con los valores parseados
          const fecha = new Date(anio, mes, dia);
          // Verifica que la fecha sea válida
          if (!isNaN(fecha.getTime())) {
            // Actualiza la fecha en el ViewModel
            viewModel.setFechaNacimiento(fecha);
          }
        }
      }
    }
  };

  // Función asíncrona que maneja el evento de guardar
  const handleGuardar = async () => {
    try {
      // Llama al método del ViewModel para guardar
      await viewModel.guardarPersona();
      // Muestra alerta de éxito con mensaje según el modo
      Alert.alert(
        'Éxito',
        viewModel.isEditMode ? 'Persona actualizada correctamente' : 'Persona creada correctamente',
        [
          {
            text: 'OK',
            // Al presionar OK, navega hacia atrás
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      // Si hay error, muestra alerta con el mensaje
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al guardar');
    }
  };

  // Si está cargando, muestra indicador de carga centrado
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
        {/* Campo de nombre */}
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={viewModel.nombre}
          // Actualiza el nombre en el ViewModel al escribir
          onChangeText={(text) => viewModel.setNombre(text)}
          placeholder="Ingrese el nombre"
        />

        {/* Campo de apellidos */}
        <Text style={styles.label}>Apellidos *</Text>
        <TextInput
          style={styles.input}
          value={viewModel.apellidos}
          // Actualiza los apellidos en el ViewModel
          onChangeText={(text) => viewModel.setApellidos(text)}
          placeholder="Ingrese los apellidos"
        />

        {/* Campo de fecha de nacimiento */}
        <Text style={styles.label}>Fecha de Nacimiento *</Text>
        <TextInput
          style={styles.input}
          value={fechaTexto}
          // Llama a la función personalizada para parsear la fecha
          onChangeText={handleFechaChange}
          placeholder="DD/MM/YYYY"
          keyboardType="numeric"
          maxLength={10}
        />
        {/* Texto de ayuda para el formato de fecha */}
        <Text style={styles.helperText}>Formato: DD/MM/YYYY (Ejemplo: 15/05/1990)</Text>

        {/* Campo de teléfono */}
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={viewModel.telefono}
          onChangeText={(text) => viewModel.setTelefono(text)}
          placeholder="Ingrese el teléfono"
          keyboardType="phone-pad"
        />

        {/* Campo de dirección con soporte multilínea */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={viewModel.direccion}
          onChangeText={(text) => viewModel.setDireccion(text)}
          placeholder="Ingrese la dirección"
          multiline
        />

        {/* Campo de URL de la foto */}
        <Text style={styles.label}>URL de la Foto</Text>
        <TextInput
          style={styles.input}
          value={viewModel.foto}
          onChangeText={(text) => viewModel.setFoto(text)}
          placeholder="https://ejemplo.com/foto.jpg"
        />

        {/* Selector de departamento */}
        <Text style={styles.label}>Departamento</Text>
        <View style={styles.pickerContainer}>
          {/* Mapea cada departamento a un botón seleccionable */}
          {departamentosVM.departamentos.map((dept) => (
            <TouchableOpacity
              key={dept.id}
              // Aplica estilo diferente si está seleccionado
              style={[
                styles.pickerOption,
                viewModel.idDepartamento === dept.id && styles.pickerOptionSelected,
              ]}
              // Actualiza el departamento seleccionado al presionar
              onPress={() => viewModel.setIdDepartamento(dept.id)}
            >
              <Text
                // Aplica estilo de texto diferente si está seleccionado
                style={[
                  styles.pickerOptionText,
                  viewModel.idDepartamento === dept.id && styles.pickerOptionTextSelected,
                ]}
              >
                {dept.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Muestra mensaje de error si existe */}
        {viewModel.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{viewModel.error}</Text>
          </View>
        )}

        {/* Contenedor de botones de acción */}
        <View style={styles.buttonContainer}>
          {/* Botón para guardar/actualizar */}
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleGuardar}
            // Deshabilita mientras está cargando
            disabled={viewModel.isLoading}
          >
            <Text style={styles.buttonText}>
              {/* Texto dinámico según el modo */}
              {viewModel.isEditMode ? 'Actualizar' : 'Guardar'}
            </Text>
          </TouchableOpacity>

          {/* Botón para cancelar */}
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

// Objeto StyleSheet con todos los estilos del componente
const styles = StyleSheet.create({
  // Estilo del contenedor principal con scroll
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
  // Estilo del contenedor del formulario
  form: {
    padding: 20,
  },
  // Estilo de las etiquetas de los campos
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  // Estilo del texto de ayuda
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  // Estilo de los campos de entrada
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Estilo del contenedor del selector de departamento
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  // Estilo de cada opción del selector
  pickerOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  // Estilo de la opción seleccionada (fondo azul)
  pickerOptionSelected: {
    backgroundColor: '#2196F3',
  },
  // Estilo del texto de las opciones
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  // Estilo del texto de la opción seleccionada (blanco y negrita)
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Estilo del contenedor de errores
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  // Estilo del texto de error
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  // Estilo del contenedor de botones
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  // Estilo base de los botones
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Estilo del botón de guardar (verde)
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  // Estilo del botón de cancelar (gris)
  cancelButton: {
    backgroundColor: '#757575',
  },
  // Estilo del texto de los botones
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Exporta el componente como default
export default EditarInsertarPersonaScreen;
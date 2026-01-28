// app/presentation/view/Persona/EditarInsertarPersonas.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { container } from '../../../core/Container';
import { TYPES } from '../../../core/types';
import { EditarInsertarPersonaVM } from '../../viewModel/EditarInsertarPersona';
import { DepartamentosVM } from '../../viewModel/DepartamentoVM';

const EditarInsertarPersonaScreen: React.FC = observer(() => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [viewModel] = useState(() => container.get<EditarInsertarPersonaVM>(TYPES.EditarInsertarPersonaVM));
  const departamentosVM = container.get<DepartamentosVM>(TYPES.DepartamentosVM);

  // Estado local para el input de fecha (formato DD/MM/YYYY)
  const [fechaTexto, setFechaTexto] = useState('');

  useEffect(() => {
    departamentosVM.cargarDepartamentos();
    
    if (params?.personaId) {
      viewModel.cargarPersona(Number(params.personaId));
    } else {
      viewModel.limpiarFormulario();
    }

    return () => {
      viewModel.limpiarFormulario();
    };
  }, [params?.personaId]);

  // Sincronizar la fecha del viewModel con el input de texto
  useEffect(() => {
    const fecha = viewModel.fechaNacimiento;
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    setFechaTexto(`${dia}/${mes}/${anio}`);
  }, [viewModel.fechaNacimiento]);

  const handleFechaChange = (texto: string) => {
    setFechaTexto(texto);
    
    // Intentar parsear la fecha cuando tenga formato completo
    if (texto.length === 10) {
      const partes = texto.split('/');
      if (partes.length === 3) {
        const dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; // Los meses en JS van de 0-11
        const anio = parseInt(partes[2]);
        
        if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
          const fecha = new Date(anio, mes, dia);
          if (!isNaN(fecha.getTime())) {
            viewModel.setFechaNacimiento(fecha);
          }
        }
      }
    }
  };

  const handleGuardar = async () => {
    try {
      await viewModel.guardarPersona();
      Alert.alert(
        'Éxito',
        viewModel.isEditMode ? 'Persona actualizada correctamente' : 'Persona creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
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
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={viewModel.nombre}
          onChangeText={(text) => viewModel.setNombre(text)}
          placeholder="Ingrese el nombre"
        />

        <Text style={styles.label}>Apellidos *</Text>
        <TextInput
          style={styles.input}
          value={viewModel.apellidos}
          onChangeText={(text) => viewModel.setApellidos(text)}
          placeholder="Ingrese los apellidos"
        />

        <Text style={styles.label}>Fecha de Nacimiento *</Text>
        <TextInput
          style={styles.input}
          value={fechaTexto}
          onChangeText={handleFechaChange}
          placeholder="DD/MM/YYYY"
          keyboardType="numeric"
          maxLength={10}
        />
        <Text style={styles.helperText}>Formato: DD/MM/YYYY (Ejemplo: 15/05/1990)</Text>

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={viewModel.telefono}
          onChangeText={(text) => viewModel.setTelefono(text)}
          placeholder="Ingrese el teléfono"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={viewModel.direccion}
          onChangeText={(text) => viewModel.setDireccion(text)}
          placeholder="Ingrese la dirección"
          multiline
        />

        <Text style={styles.label}>URL de la Foto</Text>
        <TextInput
          style={styles.input}
          value={viewModel.foto}
          onChangeText={(text) => viewModel.setFoto(text)}
          placeholder="https://ejemplo.com/foto.jpg"
        />

        <Text style={styles.label}>Departamento</Text>
        <View style={styles.pickerContainer}>
          {departamentosVM.departamentos.map((dept) => (
            <TouchableOpacity
              key={dept.id}
              style={[
                styles.pickerOption,
                viewModel.idDepartamento === dept.id && styles.pickerOptionSelected,
              ]}
              onPress={() => viewModel.setIdDepartamento(dept.id)}
            >
              <Text
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

        {viewModel.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{viewModel.error}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleGuardar}
            disabled={viewModel.isLoading}
          >
            <Text style={styles.buttonText}>
              {viewModel.isEditMode ? 'Actualizar' : 'Guardar'}
            </Text>
          </TouchableOpacity>

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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  pickerOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionSelected: {
    backgroundColor: '#2196F3',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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

export default EditarInsertarPersonaScreen;
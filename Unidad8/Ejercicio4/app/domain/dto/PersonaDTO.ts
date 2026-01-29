// Interfaz que define la estructura del objeto de transferencia de datos para Persona
export interface PersonaDTO {
  // Identificador único de la persona
  id: number;
  // Nombre de la persona
  nombre: string;
  // Apellidos de la persona
  apellidos: string;
  // URL o ruta de la foto de la persona
  foto: string;
  // Fecha de nacimiento en formato string (para transferencia de datos)
  fechaNacimiento: string; 
  // Dirección de residencia de la persona
  direccion: string;
  // Número de teléfono de la persona
  telefono: string;
  // Identificador del departamento al que pertenece la persona
  idDepartamento: number;
}
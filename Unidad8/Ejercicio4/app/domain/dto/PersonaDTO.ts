// Interfaz que define la estructura del objeto de transferencia de datos para Persona
export interface PersonaDTO {
  // Identificador único de la persona
  ID: number;
  // Nombre de la persona
  Nombre: string;
  // Apellidos de la persona
  Apellidos: string;
  // URL o ruta de la foto de la persona
  Foto: string;
  // Fecha de nacimiento en formato string (para transferencia de datos)
  FechaNacimiento: string; 
  // Dirección de residencia de la persona
  Direccion: string;
  // Número de teléfono de la persona
  Telefono: string;
  // Identificador del departamento al que pertenece la persona
  IdDepartamento: number;
}
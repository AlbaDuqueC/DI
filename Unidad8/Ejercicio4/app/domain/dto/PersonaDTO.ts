// src/domain/dtos/PersonaDTO.ts

export interface PersonaDTO {
  id: number;
  nombre: string;
  apellidos: string;
  foto: string;
  fechaNacimiento: string; // ISO string format
  direccion: string;
  telefono: string;
  idDepartamento: number;
}
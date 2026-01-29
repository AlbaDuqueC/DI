import { Persona } from '../../entities/Persona';

// Interfaz que define el contrato para el repositorio de personas
export interface IPersonaRepository {
  // Método que obtiene la lista completa de personas
  getListaPersonas(): Promise<Persona[]>;
  // Método que obtiene una persona específica por su ID
  getPersonaPorId(idPersona: number): Promise<Persona>;
  // Método que crea una nueva persona y retorna su ID
  crearPersona(personaNueva: Persona): Promise<number>;
  // Método que actualiza una persona existente y retorna su ID
  actualizarPersona(idPersona: number, persona: Persona): Promise<number>;
  // Método que elimina una persona y retorna su ID
  eliminarPersona(idPersona: number): Promise<number>;
}
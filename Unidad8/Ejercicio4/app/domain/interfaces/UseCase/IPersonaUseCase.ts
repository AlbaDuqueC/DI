import { Persona } from '../../entities/Persona'

// Interfaz que define el contrato para los casos de uso de personas
export interface IPersonaUseCase {
  // Método que obtiene todas las personas
  getPersonas(): Promise<Persona[]>;
  // Método que obtiene una persona por su identificador
  getPersonaById(id: number): Promise<Persona>;
  // Método que crea una nueva persona y retorna su ID
  crearPersona(persona: Persona): Promise<number>;
  // Método que actualiza una persona y retorna su ID
  actualizarPersona(id: number, persona: Persona): Promise<number>;
  // Método que elimina una persona y retorna su ID
  eliminarPersona(id: number): Promise<number>;
}
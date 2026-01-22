// src/domain/interfaces/usecases/personas/IPersonaUseCase.ts

import { Persona } from '../../entities/Persona'

export interface IPersonaUseCase {
  getPersonas(): Promise<Persona[]>;
  getPersonaById(id: number): Promise<Persona>;
  crearPersona(persona: Persona): Promise<number>;
  actualizarPersona(id: number, persona: Persona): Promise<number>;
  eliminarPersona(id: number): Promise<number>;
}
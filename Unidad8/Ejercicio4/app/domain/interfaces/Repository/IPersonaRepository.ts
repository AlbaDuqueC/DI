// src/domain/interfaces/repositories/IPersonaRepository.ts

import { Persona } from '../../entities/Persona';

export interface IPersonaRepository {
  getListaPersonas(): Promise<Persona[]>;
  getPersonaPorId(idPersona: number): Promise<Persona>;
  crearPersona(personaNueva: Persona): Promise<number>;
  actualizarPersona(idPersona: number, persona: Persona): Promise<number>;
  eliminarPersona(idPersona: number): Promise<number>;
}
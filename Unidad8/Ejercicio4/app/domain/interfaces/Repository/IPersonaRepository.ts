import { Persona } from "../../entities/Persona";

export interface IPersonaRepository {
  getListaPersonas(): Promise<Persona[]>;
  getPersonaPorId(id: number): Promise<Persona | null>;
  crearPersona(persona: Persona): Promise<number>;
  actualizarPersona(id: number, persona: Persona): Promise<number>;
  eliminarPersona(id: number): Promise<number>;
}
import { RepositoryPersona } from "../models/data/RepositoryPersona";

export class IndexVM {
  get personas() {
    return RepositoryPersona.getPersona();
  }

  getPersonaPorId(id: number) {
    const lista = RepositoryPersona.getPersona();
    return lista.find(persona => persona.id === id);
  }

  obtenerDatosPersona(id: number): { id: string; nombre: string; apellido: string } | null {
    const persona = RepositoryPersona.getPersona().find(p => p.id === id);
    if (!persona) return null;
    return {
      id: persona.id.toString(),
      nombre: persona.nombre,
      apellido: persona.apellido,
    };
  }
}
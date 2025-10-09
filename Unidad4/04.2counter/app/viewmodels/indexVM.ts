import {RepositoryPersona} from "../models/data/RepositoryPersona"

class IndexVM {
  get personas() {
    return RepositoryPersona.getPersona();
  }

  getPersonaPorId(id: number) {
    const lista = RepositoryPersona.getPersona();
    return lista.find(persona => persona.id === id);
  }
}
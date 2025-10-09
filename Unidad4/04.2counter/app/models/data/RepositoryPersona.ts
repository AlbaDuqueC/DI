import {Persona} from "../entities/PersonaModel"

export class RepositoryPersona {

    private static personas: Persona[] = [
    new Persona(1, "Juan", "Pérez"),
    new Persona(2, "María", "Gómez"),
    new Persona(3, "Luis", "Ramírez"),
    new Persona(4, "Ana", "Martínez"),
    new Persona(5, "Carlos", "Fernández"),
    new Persona(6, "Lucía", "Rodríguez"),
    new Persona(7, "Pedro", "López"),
    new Persona(8, "Sofía", "García"),
    new Persona(9, "Diego", "Sánchez"),
    new Persona(10, "Valentina", "Torres"),
  ];

  static getPersona(): Persona[] {
    return this.personas;
  }
}



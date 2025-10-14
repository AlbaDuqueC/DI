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
    new Persona(11, "Juan", "Pérez"),
    new Persona(12, "María", "Gómez"),
    new Persona(13, "Luis", "Ramírez"),
    new Persona(14, "Ana", "Martínez"),
    new Persona(15, "Carlos", "Fernández"),
    new Persona(16, "Lucía", "Rodríguez"),
    new Persona(17, "Pedro", "López"),
    new Persona(18, "Sofía", "García"),
    new Persona(19, "Diego", "Sánchez"),
    new Persona(20, "Valentina", "Torres"),
    new Persona(21, "Juan", "Pérez"),
    new Persona(22, "María", "Gómez"),
    new Persona(23, "Luis", "Ramírez"),
    new Persona(24, "Ana", "Martínez"),
    new Persona(25, "Carlos", "Fernández"),
    new Persona(26, "Lucía", "Rodríguez"),
    new Persona(27, "Pedro", "López"),
    new Persona(28, "Sofía", "García"),
    new Persona(29, "Diego", "Sánchez"),
    new Persona(30, "Valentina", "Torres"),
    new Persona(31, "Juan", "Pérez"),
    new Persona(32, "María", "Gómez"),
    new Persona(33, "Luis", "Ramírez"),
    new Persona(34, "Ana", "Martínez"),
    new Persona(35, "Carlos", "Fernández"),
    new Persona(36, "Lucía", "Rodríguez"),
    new Persona(37, "Pedro", "López"),
    new Persona(38, "Sofía", "García"),
    new Persona(39, "Diego", "Sánchez"),
    new Persona(40, "Valentina", "Torres"),
  ];

  static getPersona(): Persona[] {
    return this.personas;
  }
}



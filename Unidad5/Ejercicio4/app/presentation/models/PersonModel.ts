import { Person } from "../../domain/entities/Person";

export class PersonModel {
  id: number;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;

  constructor(person: Person) {
    this.id = person.getId();
    this.nombre = person.getNombre();
    this.apellidos = person.getApellidos();
    this.fechaNacimiento = person.getFechaNacimiento();
  }
}

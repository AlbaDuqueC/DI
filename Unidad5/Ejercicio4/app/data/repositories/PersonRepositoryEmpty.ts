import { IPersonRepository } from "../../domain/repositories/IPersonRepository";
import { Person } from "../../domain/entities/Person";

export class PersonRepositoryEmpty implements IPersonRepository {
  private persons: Person[];

  constructor() {
    this.persons = [];
  }

  getAllPersons(): Person[] {
    return this.persons;
  }
}

import { IPersonRepository } from "../repositories/IPersonRepository";
import { IPersonRepositoryUseCase } from "../interfaces/IPersonRepositoryUseCase";
import { Person } from "../entities/Person";

export class PersonRepositoryUseCase implements IPersonRepositoryUseCase {
  private repository: IPersonRepository;

  constructor(repository: IPersonRepository) {
    this.repository = repository;
  }

  execute(): Person[] {
    const persons = this.repository.getAllPersons();
    if (persons.length === 0) return [];

    const day = new Date().getDay(); // 0 = domingo ... 6 = sábado
    const index = day % persons.length;
    return [persons[index]];
  }
}

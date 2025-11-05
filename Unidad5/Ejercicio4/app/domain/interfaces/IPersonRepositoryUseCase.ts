import { Person } from "../entities/Person";

export interface IPersonRepositoryUseCase {
  execute(): Person[];
}

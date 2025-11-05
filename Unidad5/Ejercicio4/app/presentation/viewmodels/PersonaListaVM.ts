import { useState, useEffect } from "react";
import { PersonModel } from "../models/PersonModel";
import { PersonRepositoryUseCase } from "../../domain/usecases/PersonRepositoryUseCase";
import { PersonRepository100 } from "../../data/repositories/PersonRepository100";
import { PersonRepositoryEmpty } from "../../data/repositories/PersonRepositoryEmpty";


export const usePersonaListaVM = (useEmpty = false) => {
  const [personas, setPersonas] = useState<PersonModel[]>([]);

  useEffect(() => {
    const repository = useEmpty
      ? new PersonRepositoryEmpty()
      : new PersonRepository100();

    const useCase = new PersonRepositoryUseCase(repository);
    const domainPersons = useCase.execute();
    const models = domainPersons.map((p) => new PersonModel(p));
    setPersonas(models);
  }, [useEmpty]);

  return { personas };
};

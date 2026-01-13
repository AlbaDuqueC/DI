import { Container } from "inversify";
import "reflect-metadata";
import { PersonasRepo } from "../data/repositories/PersonaRepo";
import { PersonasRepo100 } from "../data/repositories/PersonaRepo100";
import { PeopleListVM } from "../UI/ViewModel/PeopleListVM";
import { TYPES } from "./types";


const container = new Container();


// Vinculamos la interfaz con su implementación concreta
container.bind<PersonasRepo100>(TYPES.IRepositoryPersonas).to(PersonasRepo100);
container.bind<PeopleListVM>(TYPES.IndexVM).to(PeopleListVM);
export { container };



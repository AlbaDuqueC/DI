import { Container } from "inversify";
import "reflect-metadata";
import { IRepositoryPersonas, PersonasRepository, PersonasRepository100, PersonasRepositoryEmpty } from "../models/data/personasRepository";
import { PeopleListVM } from "../viewmodels/PeopleListVM";
import { TYPES } from "./types";


const container = new Container();


// Vinculamos la interfaz con su implementación concreta
container.bind<IRepositoryPersonas>(TYPES.IRepositoryPersonas).to(PersonasRepository100);
container.bind<PeopleListVM>(TYPES.IndexVM).to(PeopleListVM);
export { container };



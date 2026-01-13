import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// Data
import { AzureAPI } from "../data/datasource/AzureAPI";
import { PersonaRepository } from "../data/repositories/PersonaRepository";
import { DepartamentoRepository } from "../data/repositories/DepartamentoRepository";

// Interfaces
import type { IPersonaRepository } from "../domain/interfaces/repositories/IPersonaRepository";
import type { IDepartamentoRepository } from "../domain/interfaces/repositories/IDepartamentoRepository";

const container = new Container();

// Datasources
container.bind<AzureAPI>(TYPES.AzureAPI).to(AzureAPI).inSingletonScope();

// Repositories
container.bind<IPersonaRepository>(TYPES.IPersonaRepository).to(PersonaRepository).inSingletonScope();
container.bind<IDepartamentoRepository>(TYPES.IDepartamentoRepository).to(DepartamentoRepository).inSingletonScope();

// ⏳ Agregaremos UseCases y ViewModels después

export { container };
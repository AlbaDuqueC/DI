// src/core/container.ts

import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';

// Data
import { AzureAPI } from '../data/datasource/AzureAPI';
import { PersonaRepositoryAzure } from '../data/Repository/PersonaRepositoryAzure';
import { DepartamentoRepositoryAzure } from '../data/Repository/DepartamentoRepositoryAzure';

// Domain
import { IPersonaRepository } from '../domain/interfaces/Repository/IPersonaRepository';
import { IDepartamentoRepository} from '../domain/interfaces/Repository/IDepartamentoRepository'
import { IPersonaUseCase } from '../domain/interfaces/UseCase/IPersonaUseCase';
import { IDepartamentoUseCase } from '../domain/interfaces/UseCase/IDepartamentoUseCase';
import { PersonaUseCase } from '../domain/useCase/PersonaUseCase';
import { DepartamentoUseCase } from '../domain/useCase/DepartamentoUseCase'

// Presentation
import { PersonasVM } from '../presentation/viewModel/PersonaVM';
import { DepartamentosVM } from '../presentation/viewModel/DepartamentoVM';
import { EditarInsertarPersonaVM } from '../presentation/viewModel/EditarInsertarPersona';
import { EditarInsertarDepartamentoVM } from '../presentation/viewModel/EditarInsertarDepartamento';

const container = new Container();

// Bind API
container.bind<AzureAPI>(TYPES.AzureAPI).to(AzureAPI).inSingletonScope();

// Bind Repositories
container.bind<IPersonaRepository>(TYPES.IPersonaRepository).to(PersonaRepositoryAzure);
container.bind<IDepartamentoRepository>(TYPES.IDepartamentoRepository).to(DepartamentoRepositoryAzure);

// Bind Use Cases
container.bind<IPersonaUseCase>(TYPES.IPersonaUseCase).to(PersonaUseCase);
container.bind<IDepartamentoUseCase>(TYPES.IDepartamentoUseCase).to(DepartamentoUseCase);


// Bind ViewModels
container.bind<PersonasVM>(TYPES.PersonasVM).to(PersonasVM).inSingletonScope();
container.bind<DepartamentosVM>(TYPES.DepartamentosVM).to(DepartamentosVM).inSingletonScope();
container.bind<EditarInsertarPersonaVM>(TYPES.EditarInsertarPersonaVM).to(EditarInsertarPersonaVM);
container.bind<EditarInsertarDepartamentoVM>(TYPES.EditarInsertarDepartamentoVM).to(EditarInsertarDepartamentoVM);

export { container };
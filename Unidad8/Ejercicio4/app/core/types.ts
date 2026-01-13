export const TYPES = {
  // Datasources
  AzureAPI: 'AzureAPI',

  // Repositories
  IPersonaRepository: 'IPersonaRepository',
  IDepartamentoRepository: 'IDepartamentoRepository',

  // UseCases - Personas
  IObtenerPersonasUseCase: 'IObtenerPersonasUseCase',
  ICrearPersonaUseCase: 'ICrearPersonaUseCase',
  IActualizarPersonaUseCase: 'IActualizarPersonaUseCase',
  IEliminarPersonaUseCase: 'IEliminarPersonaUseCase',

  // UseCases - Departamentos
  IObtenerDepartamentosUseCase: 'IObtenerDepartamentosUseCase',
  ICrearDepartamentoUseCase: 'ICrearDepartamentoUseCase',
  IActualizarDepartamentoUseCase: 'IActualizarDepartamentoUseCase',
  IEliminarDepartamentoUseCase: 'IEliminarDepartamentoUseCase',

  // ViewModels
  PersonasVM: 'PersonasVM',
  DepartamentosVM: 'DepartamentosVM',
} as const;
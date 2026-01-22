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
  IDepartamentoUseCase: 'IDepartamentoUseCase',
  IPersonaUseCase: 'IPersonaUseCase',


  // ViewModels
  PersonasVM: 'PersonasVM',
  DepartamentosVM: 'DepartamentosVM',
  EditarInsertarPersonaVM: 'EditarInsertarPersonaVM', // <-- Añade esta línea
  EditarInsertarDepartamentoVM: 'EditarInsertarDepartamentoVM',

  PersonaModel: 'PersonaModel',
} as const;
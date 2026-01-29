import { Departamento } from '../../entities/Departamento';

// Interfaz que define el contrato para el repositorio de departamentos
export interface IDepartamentoRepository {
  // Método que obtiene la lista completa de departamentos
  getListaDepartamentos(): Promise<Departamento[]>;
  // Método que obtiene un departamento específico por su ID
  getDepartamentoPorId(idDepartamento: number): Promise<Departamento>;
  // Método que crea un nuevo departamento y retorna su ID
  crearDepartamento(departamentoNuevo: Departamento): Promise<number>;
  // Método que actualiza un departamento existente y retorna su ID
  actualizarDepartamento(idDepartamento: number, departamento: Departamento): Promise<number>;
  // Método que elimina un departamento y retorna su ID
  eliminarDepartamento(idDepartamento: number): Promise<number>;
  // Método que cuenta cuántas personas están asignadas a un departamento
  contarPersonasDepartamento(idDepartamento: number): Promise<number>;
}
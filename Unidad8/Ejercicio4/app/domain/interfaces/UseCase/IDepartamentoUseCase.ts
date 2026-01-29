import { Departamento } from '../../entities/Departamento';

// Interfaz que define el contrato para los casos de uso de departamentos
export interface IDepartamentoUseCase {
  // Método que obtiene todos los departamentos
  getDepartamentos(): Promise<Departamento[]>;
  // Método que obtiene un departamento por su identificador
  getDepartamentoById(id: number): Promise<Departamento>;
  // Método que crea un nuevo departamento y retorna su ID
  crearDepartamento(departamento: Departamento): Promise<number>;
  // Método que actualiza un departamento y retorna su ID
  actualizarDepartamento(id: number, departamento: Departamento): Promise<number>;
  // Método que elimina un departamento y retorna su ID
  eliminarDepartamento(id: number): Promise<number>;
}
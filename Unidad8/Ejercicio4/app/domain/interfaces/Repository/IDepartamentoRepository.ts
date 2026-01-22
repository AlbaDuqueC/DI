import { Departamento } from '../../entities/Departamento';

export interface IDepartamentoRepository {
  getListaDepartamentos(): Promise<Departamento[]>;
  getDepartamentoPorId(idDepartamento: number): Promise<Departamento>;
  crearDepartamento(departamentoNuevo: Departamento): Promise<number>;
  actualizarDepartamento(idDepartamento: number, departamento: Departamento): Promise<number>;
  eliminarDepartamento(idDepartamento: number): Promise<number>;
  contarPersonasDepartamento(idDepartamento: number): Promise<number>;
}
// src/domain/interfaces/usecases/departamentos/IDepartamentoUseCase.ts

import { Departamento } from '../../entities/Departamento';

export interface IDepartamentoUseCase {
  getDepartamentos(): Promise<Departamento[]>;
  getDepartamentoById(id: number): Promise<Departamento>;
  crearDepartamento(departamento: Departamento): Promise<number>;
  actualizarDepartamento(id: number, departamento: Departamento): Promise<number>;
  eliminarDepartamento(id: number): Promise<number>;
}
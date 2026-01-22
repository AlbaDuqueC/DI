// src/domain/usecases/DepartamentoUseCase.ts

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IDepartamentoUseCase } from '../interfaces/UseCase/IDepartamentoUseCase';
import { IDepartamentoRepository } from '../interfaces/Repository/IDepartamentoRepository';
import { Departamento } from '../entities/Departamento';
import { TYPES } from '../../core/types';

@injectable()
export class DepartamentoUseCase implements IDepartamentoUseCase {
  private readonly _repository: IDepartamentoRepository;

  static inject = [TYPES.IDepartamentoRepository];
  
  constructor( repository: IDepartamentoRepository) {
    this._repository = repository;
  }

  public async getDepartamentos(): Promise<Departamento[]> {
    try {
      return await this._repository.getListaDepartamentos();
    } catch (error) {
      console.error('Error en getDepartamentos:', error);
      throw error;
    }
  }

  public async getDepartamentoById(id: number): Promise<Departamento> {
    try {
      return await this._repository.getDepartamentoPorId(id);
    } catch (error) {
      console.error('Error en getDepartamentoById:', error);
      throw error;
    }
  }

  public async crearDepartamento(departamento: Departamento): Promise<number> {
    try {
      return await this._repository.crearDepartamento(departamento);
    } catch (error) {
      console.error('Error en crearDepartamento:', error);
      throw error;
    }
  }

  public async actualizarDepartamento(id: number, departamento: Departamento): Promise<number> {
    try {
      return await this._repository.actualizarDepartamento(id, departamento);
    } catch (error) {
      console.error('Error en actualizarDepartamento:', error);
      throw error;
    }
  }

  public async eliminarDepartamento(id: number): Promise<number> {
    try {
      // Verificar si hay personas en el departamento antes de eliminar
      const count = await this._repository.contarPersonasDepartamento(id);
      
      if (count > 0) {
        throw new Error(`No se puede eliminar el departamento porque tiene ${count} persona(s) asignada(s)`);
      }

      return await this._repository.eliminarDepartamento(id);
    } catch (error) {
      console.error('Error en eliminarDepartamento:', error);
      throw error;
    }
  }
}
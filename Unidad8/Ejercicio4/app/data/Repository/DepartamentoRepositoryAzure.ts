// src/data/repositories/DepartamentoRepositoryAzure.ts

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IDepartamentoRepository } from '../../domain/interfaces/Repository/IDepartamentoRepository';
import { Departamento } from '../../domain/entities/Departamento';
import { DepartamentoDTO } from '../../domain/dto/DepartamentoDTO';
import { AzureAPI } from '../datasource/AzureAPI';
import { TYPES } from '../../core/types';

@injectable()
export class DepartamentoRepositoryAzure implements IDepartamentoRepository {
  private readonly _api: AzureAPI;

  static inject = [TYPES.AzureAPI];


  constructor(api: AzureAPI) {
    this._api = api;
  }

  private dtoToEntity(dto: DepartamentoDTO): Departamento {
    return new Departamento(dto.id, dto.nombre);
  }

  private entityToDto(departamento: Departamento): DepartamentoDTO {
    return {
      id: departamento.id,
      nombre: departamento.nombre
    };
  }

  public async getListaDepartamentos(): Promise<Departamento[]> {
    try {
      const dtos = await this._api.get<DepartamentoDTO[]>('/departamentos');
      return dtos.map(dto => this.dtoToEntity(dto));
    } catch (error) {
      console.error('Error al obtener lista de departamentos:', error);
      throw error;
    }
  }

  public async getDepartamentoPorId(idDepartamento: number): Promise<Departamento> {
    try {
      const dto = await this._api.get<DepartamentoDTO>(`/departamentos/${idDepartamento}`);
      return this.dtoToEntity(dto);
    } catch (error) {
      console.error('Error al obtener departamento por ID:', error);
      throw error;
    }
  }

  public async crearDepartamento(departamentoNuevo: Departamento): Promise<number> {
    try {
      const dto = this.entityToDto(departamentoNuevo);
      const response = await this._api.post<{ id: number }>('/departamentos', dto);
      return response.id;
    } catch (error) {
      console.error('Error al crear departamento:', error);
      throw error;
    }
  }

  public async actualizarDepartamento(idDepartamento: number, departamento: Departamento): Promise<number> {
    try {
      const dto = this.entityToDto(departamento);
      await this._api.put<void>(`/departamentos/${idDepartamento}`, dto);
      return idDepartamento;
    } catch (error) {
      console.error('Error al actualizar departamento:', error);
      throw error;
    }
  }

  public async eliminarDepartamento(idDepartamento: number): Promise<number> {
    try {
      await this._api.delete<void>(`/departamentos/${idDepartamento}`);
      return idDepartamento;
    } catch (error) {
      console.error('Error al eliminar departamento:', error);
      throw error;
    }
  }

  public async contarPersonasDepartamento(idDepartamento: number): Promise<number> {
    try {
      const response = await this._api.get<{ count: number }>(`/departamentos/${idDepartamento}/personas/count`);
      return response.count;
    } catch (error) {
      console.error('Error al contar personas del departamento:', error);
      throw error;
    }
  }
}
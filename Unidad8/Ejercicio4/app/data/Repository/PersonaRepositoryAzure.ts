// src/data/repositories/PersonaRepositoryAzure.ts

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IPersonaRepository } from '../../domain/interfaces/Repository/IPersonaRepository';
import { Persona } from '../../domain/entities/Persona';
import { PersonaDTO } from '../../domain/dto/PersonaDTO';
import { AzureAPI } from '../datasource/AzureAPI';
import { TYPES } from '../../core/types';

@injectable()
export class PersonaRepositoryAzure implements IPersonaRepository {
  private readonly _api: AzureAPI;

  static inject = [TYPES.AzureAPI];

  
  constructor(api: AzureAPI) {
    this._api = api;
  }

  private dtoToEntity(dto: PersonaDTO): Persona {
    return new Persona(
      dto.id,
      dto.nombre,
      dto.apellidos,
      dto.foto,
      new Date(dto.fechaNacimiento),
      dto.direccion,
      dto.telefono,
      dto.idDepartamento
    );
  }

  private entityToDto(persona: Persona): PersonaDTO {
    return {
      id: persona.id,
      nombre: persona.nombre,
      apellidos: persona.apellidos,
      foto: persona.foto,
      fechaNacimiento: persona.fechaNacimiento.toISOString(),
      direccion: persona.direccion,
      telefono: persona.telefono,
      idDepartamento: persona.idDepartamento
    };
  }

  public async getListaPersonas(): Promise<Persona[]> {
    try {
      const dtos = await this._api.get<PersonaDTO[]>('/personas');
      return dtos.map(dto => this.dtoToEntity(dto));
    } catch (error) {
      console.error('Error al obtener lista de personas:', error);
      throw error;
    }
  }

  public async getPersonaPorId(idPersona: number): Promise<Persona> {
    try {
      const dto = await this._api.get<PersonaDTO>(`/personas/${idPersona}`);
      return this.dtoToEntity(dto);
    } catch (error) {
      console.error('Error al obtener persona por ID:', error);
      throw error;
    }
  }

  public async crearPersona(personaNueva: Persona): Promise<number> {
    try {
      const dto = this.entityToDto(personaNueva);
      const response = await this._api.post<{ id: number }>('/personas', dto);
      return response.id;
    } catch (error) {
      console.error('Error al crear persona:', error);
      throw error;
    }
  }

  public async actualizarPersona(idPersona: number, persona: Persona): Promise<number> {
    try {
      const dto = this.entityToDto(persona);
      await this._api.put<void>(`/personas/${idPersona}`, dto);
      return idPersona;
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      throw error;
    }
  }

  public async eliminarPersona(idPersona: number): Promise<number> {
    try {
      await this._api.delete<void>(`/personas/${idPersona}`);
      return idPersona;
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      throw error;
    }
  }
}
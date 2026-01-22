// src/domain/usecases/PersonaUseCase.ts

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IPersonaUseCase } from '../interfaces/UseCase/IPersonaUseCase';
import { IPersonaRepository } from '../interfaces/Repository/IPersonaRepository';
import { Persona } from '../entities/Persona';
import { TYPES } from '../../core/types';

@injectable()
export class PersonaUseCase implements IPersonaUseCase {
  private readonly _repository: IPersonaRepository;

  static inject = [TYPES.IPersonaRepository]
  constructor(repository: IPersonaRepository) {
    this._repository = repository;
  }

  /**
   * Regla de negocio: Los viernes y sábados, solo se muestran personas mayores de 18 años
   */
  public async getPersonas(): Promise<Persona[]> {
    try {
      const personas = await this._repository.getListaPersonas();
      
      const hoy = new Date();
      const diaSemana = hoy.getDay(); // 0 = Domingo, 5 = Viernes, 6 = Sábado

      // Si es viernes (5) o sábado (6), filtrar solo mayores de 18
      if (diaSemana === 5 || diaSemana === 6) {
        return personas.filter(persona => persona.getEdad() > 18);
      }

      return personas;
    } catch (error) {
      console.error('Error en getPersonas:', error);
      throw error;
    }
  }

  public async getPersonaById(id: number): Promise<Persona> {
    try {
      return await this._repository.getPersonaPorId(id);
    } catch (error) {
      console.error('Error en getPersonaById:', error);
      throw error;
    }
  }

  public async crearPersona(persona: Persona): Promise<number> {
    try {
      return await this._repository.crearPersona(persona);
    } catch (error) {
      console.error('Error en crearPersona:', error);
      throw error;
    }
  }

  public async actualizarPersona(id: number, persona: Persona): Promise<number> {
    try {
      return await this._repository.actualizarPersona(id, persona);
    } catch (error) {
      console.error('Error en actualizarPersona:', error);
      throw error;
    }
  }

  /**
   * Regla de negocio: Los domingos no se permite eliminar personas
   */
  public async eliminarPersona(id: number): Promise<number> {
    try {
      const hoy = new Date();
      const diaSemana = hoy.getDay(); // 0 = Domingo

      if (diaSemana === 0) {
        throw new Error('No se pueden eliminar personas los domingos');
      }

      return await this._repository.eliminarPersona(id);
    } catch (error) {
      console.error('Error en eliminarPersona:', error);
      throw error;
    }
  }
}
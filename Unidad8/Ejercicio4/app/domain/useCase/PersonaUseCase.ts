// app/domain/useCase/PersonaUseCase.ts

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IPersonaUseCase } from '../interfaces/UseCase/IPersonaUseCase';
import { IPersonaRepository } from '../interfaces/Repository/IPersonaRepository';
import { Persona } from '../entities/Persona';
import { TYPES } from '../../core/types';

@injectable()
export class PersonaUseCase implements IPersonaUseCase {
  private readonly _repository: IPersonaRepository;

  constructor(
    @inject(TYPES.IPersonaRepository) repository: IPersonaRepository
  ) {
    this._repository = repository;
  }

  // ✅ Implementación de IPersonaUseCase.getPersonas()
  // que internamente llama a IPersonaRepository.getListaPersonas()
  public async getPersonas(): Promise<Persona[]> {
    try {
      console.log('🔄 UseCase: Obteniendo personas...');
      const personas = await this._repository.getListaPersonas();
      console.log('✅ UseCase: Personas obtenidas:', personas.length);
      return personas;
    } catch (error) {
      console.error('❌ UseCase: Error al obtener personas:', error);
      throw new Error('No se pudieron cargar las personas');
    }
  }

  // ✅ Implementación de IPersonaUseCase.getPersonaById()
  // que internamente llama a IPersonaRepository.getPersonaPorId()
  public async getPersonaById(id: number): Promise<Persona> {
    try {
      console.log(`🔄 UseCase: Obteniendo persona con ID ${id}...`);
      const persona = await this._repository.getPersonaPorId(id);
      console.log('✅ UseCase: Persona obtenida:', persona.getNombreCompleto());
      return persona;
    } catch (error) {
      console.error(`❌ UseCase: Error al obtener persona ${id}:`, error);
      throw new Error('No se pudo cargar la persona');
    }
  }

  // ✅ Implementación de IPersonaUseCase.crearPersona()
  public async crearPersona(persona: Persona): Promise<number> {
    try {
      // Validaciones de negocio
      if (!persona.nombre || persona.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio');
      }
      
      if (!persona.apellidos || persona.apellidos.trim() === '') {
        throw new Error('Los apellidos son obligatorios');
      }

      console.log('🔄 UseCase: Creando persona...', persona.getNombreCompleto());
      const id = await this._repository.crearPersona(persona);
      console.log('✅ UseCase: Persona creada con ID:', id);
      return id;
    } catch (error) {
      console.error('❌ UseCase: Error al crear persona:', error);
      throw error instanceof Error ? error : new Error('No se pudo crear la persona');
    }
  }

  // ✅ Implementación de IPersonaUseCase.actualizarPersona()
  public async actualizarPersona(id: number, persona: Persona): Promise<number> {
    try {
      // Validaciones de negocio
      if (!persona.nombre || persona.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio');
      }
      
      if (!persona.apellidos || persona.apellidos.trim() === '') {
        throw new Error('Los apellidos son obligatorios');
      }

      console.log(`🔄 UseCase: Actualizando persona ${id}...`, persona.getNombreCompleto());
      const resultado = await this._repository.actualizarPersona(id, persona);
      console.log('✅ UseCase: Persona actualizada');
      return resultado;
    } catch (error) {
      console.error(`❌ UseCase: Error al actualizar persona ${id}:`, error);
      throw error instanceof Error ? error : new Error('No se pudo actualizar la persona');
    }
  }

  // ✅ Implementación de IPersonaUseCase.eliminarPersona()
  public async eliminarPersona(id: number): Promise<number> {
    try {
      console.log(`🔄 UseCase: Eliminando persona ${id}...`);
      const resultado = await this._repository.eliminarPersona(id);
      console.log('✅ UseCase: Persona eliminada');
      return resultado;
    } catch (error) {
      console.error(`❌ UseCase: Error al eliminar persona ${id}:`, error);
      throw new Error('No se pudo eliminar la persona');
    }
  }
}
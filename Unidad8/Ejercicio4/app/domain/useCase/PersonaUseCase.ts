// app/domain/useCase/PersonaUseCase.ts

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IPersonaUseCase } from '../interfaces/UseCase/IPersonaUseCase';
import { IPersonaRepository } from '../interfaces/Repository/IPersonaRepository';
import { Persona } from '../entities/Persona';
import { TYPES } from '../../core/types';

// Decorador que marca la clase como inyectable
@injectable()
export class PersonaUseCase implements IPersonaUseCase {
  // Propiedad privada que almacena la instancia del repositorio de personas
  private readonly _repository: IPersonaRepository;

  // Constructor que recibe el repositorio mediante inyección de dependencias
  constructor(
    @inject(TYPES.IPersonaRepository) repository: IPersonaRepository
  ) {
    // Asigna el repositorio a la propiedad privada
    this._repository = repository;
  }

  // Método público que obtiene la lista completa de personas
  public async getPersonas(): Promise<Persona[]> {
    try {
      // Registra en consola el inicio de la operación
      console.log('UseCase: Obteniendo personas...');
      // Obtiene las personas del repositorio
      const personas = await this._repository.getListaPersonas();
      // Registra la cantidad de personas obtenidas
      console.log('UseCase: Personas obtenidas:', personas.length);
      // Retorna las personas
      return personas;
    } catch (error) {
      // Registra el error en consola
      console.error('UseCase: Error al obtener personas:', error);
      // Lanza un error descriptivo
      throw new Error('No se pudieron cargar las personas');
    }
  }

  // Método público que obtiene una persona específica por su ID
  public async getPersonaById(id: number): Promise<Persona> {
    try {
      // Registra el inicio de la búsqueda
      console.log(`UseCase: Obteniendo persona con ID ${id}...`);
      // Obtiene la persona del repositorio
      const persona = await this._repository.getPersonaPorId(id);
      // Registra la persona encontrada
      console.log('✅ UseCase: Persona obtenida:', persona.getNombreCompleto());
      // Retorna la persona
      return persona;
    } catch (error) {
      // Registra el error
      console.error(`UseCase: Error al obtener persona ${id}:`, error);
      // Lanza un error descriptivo
      throw new Error('No se pudo cargar la persona');
    }
  }

  // Método público que crea una nueva persona aplicando validaciones de negocio
  public async crearPersona(persona: Persona): Promise<number> {
    try {
      // Valida que el nombre no esté vacío
      if (!persona.nombre || persona.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio');
      }
      
      // Valida que los apellidos no estén vacíos
      if (!persona.apellidos || persona.apellidos.trim() === '') {
        throw new Error('Los apellidos son obligatorios');
      }

      // Registra el inicio de la creación
      console.log('UseCase: Creando persona...', persona.getNombreCompleto());
      // Crea la persona en el repositorio
      const id = await this._repository.crearPersona(persona);
      // Registra el ID de la persona creada
      console.log('UseCase: Persona creada con ID:', id);
      // Retorna el ID
      return id;
    } catch (error) {
      // Registra el error
      console.error('UseCase: Error al crear persona:', error);
      // Propaga el error si ya es una instancia de Error, o crea uno nuevo
      throw error instanceof Error ? error : new Error('No se pudo crear la persona');
    }
  }

  // Método público que actualiza una persona existente aplicando validaciones
  public async actualizarPersona(id: number, persona: Persona): Promise<number> {
    try {
      // Valida que el nombre no esté vacío
      if (!persona.nombre || persona.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio');
      }
      
      // Valida que los apellidos no estén vacíos
      if (!persona.apellidos || persona.apellidos.trim() === '') {
        throw new Error('Los apellidos son obligatorios');
      }

      // Registra el inicio de la actualización
      console.log(`UseCase: Actualizando persona ${id}...`, persona.getNombreCompleto());
      // Actualiza la persona en el repositorio
      const resultado = await this._repository.actualizarPersona(id, persona);
      // Registra la actualización exitosa
      console.log('UseCase: Persona actualizada');
      // Retorna el resultado
      return resultado;
    } catch (error) {
      // Registra el error
      console.error(`UseCase: Error al actualizar persona ${id}:`, error);
      // Propaga el error apropiado
      throw error instanceof Error ? error : new Error('No se pudo actualizar la persona');
    }
  }

  // Método público que elimina una persona por su ID
  public async eliminarPersona(id: number): Promise<number> {
    try {
      // Registra el inicio de la eliminación
      console.log(`UseCase: Eliminando persona ${id}...`);
      // Elimina la persona del repositorio
      const resultado = await this._repository.eliminarPersona(id);
      // Registra la eliminación exitosa
      console.log('UseCase: Persona eliminada');
      // Retorna el resultado
      return resultado;
    } catch (error) {
      // Registra el error
      console.error(`UseCase: Error al eliminar persona ${id}:`, error);
      // Lanza un error descriptivo
      throw new Error('No se pudo eliminar la persona');
    }
  }
}
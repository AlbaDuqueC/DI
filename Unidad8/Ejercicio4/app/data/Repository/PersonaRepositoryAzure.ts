// app/data/Repository/PersonaRepositoryAzure.ts

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

  constructor(@inject(TYPES.AzureAPI) api: AzureAPI) {
    this._api = api;
    console.log('✅ PersonaRepositoryAzure inicializado');
  }

  private dtoToEntity(dto: PersonaDTO): Persona {
    console.log('🔄 Convirtiendo DTO a Entidad:', dto);
    
    const persona = new Persona(
      dto.id,
      dto.nombre,
      dto.apellidos,
      dto.foto,
      new Date(dto.fechaNacimiento),
      dto.direccion,
      dto.telefono,
      dto.idDepartamento
    );
    
    console.log('✅ Persona convertida:', {
      id: persona.id,
      nombreCompleto: persona.getNombreCompleto(),
      edad: persona.getEdad()
    });
    
    return persona;
  }

  private entityToDto(persona: Persona): PersonaDTO {
    console.log('🔄 Convirtiendo Entidad a DTO:', persona.getNombreCompleto());
    
    const dto = {
      id: persona.id,
      nombre: persona.nombre,
      apellidos: persona.apellidos,
      foto: persona.foto,
      fechaNacimiento: persona.fechaNacimiento.toISOString(),
      direccion: persona.direccion,
      telefono: persona.telefono,
      idDepartamento: persona.idDepartamento
    };
    
    console.log('✅ DTO creado:', dto);
    return dto;
  }

  public async getListaPersonas(): Promise<Persona[]> {
    console.log('🔄 Repository: Obteniendo lista de personas...');
    
    try {
      const dtos = await this._api.get<PersonaDTO[]>('/personas');
      console.log(`✅ Repository: ${dtos.length} personas obtenidas de la API`);
      
      const personas = dtos.map(dto => this.dtoToEntity(dto));
      console.log(`✅ Repository: ${personas.length} personas convertidas a entidades`);
      
      return personas;
    } catch (error) {
      console.error('❌ Repository: Error al obtener lista de personas:', error);
      throw error;
    }
  }

  public async getPersonaPorId(idPersona: number): Promise<Persona> {
    console.log(`🔄 Repository: Obteniendo persona con ID ${idPersona}...`);
    
    try {
      const dto = await this._api.get<PersonaDTO>(`/personas/${idPersona}`);
      console.log(`✅ Repository: Persona obtenida de la API`);
      
      const persona = this.dtoToEntity(dto);
      return persona;
    } catch (error) {
      console.error(`❌ Repository: Error al obtener persona ${idPersona}:`, error);
      throw error;
    }
  }

  public async crearPersona(personaNueva: Persona): Promise<number> {
    console.log('🔄 Repository: Creando nueva persona...');
    
    try {
      const dto = this.entityToDto(personaNueva);
      const response = await this._api.post<{ id: number }>('/personas', dto);
      console.log(`✅ Repository: Persona creada con ID ${response.id}`);
      
      return response.id;
    } catch (error) {
      console.error('❌ Repository: Error al crear persona:', error);
      throw error;
    }
  }

  public async actualizarPersona(idPersona: number, persona: Persona): Promise<number> {
    console.log(`🔄 Repository: Actualizando persona ${idPersona}...`);
    
    try {
      const dto = this.entityToDto(persona);
      await this._api.put<void>(`/personas/${idPersona}`, dto);
      console.log(`✅ Repository: Persona ${idPersona} actualizada`);
      
      return idPersona;
    } catch (error) {
      console.error(`❌ Repository: Error al actualizar persona ${idPersona}:`, error);
      throw error;
    }
  }

  public async eliminarPersona(idPersona: number): Promise<number> {
    console.log(`🔄 Repository: Eliminando persona ${idPersona}...`);
    
    try {
      await this._api.delete<void>(`/personas/${idPersona}`);
      console.log(`✅ Repository: Persona ${idPersona} eliminada`);
      
      return idPersona;
    } catch (error) {
      console.error(`❌ Repository: Error al eliminar persona ${idPersona}:`, error);
      throw error;
    }
  }
}
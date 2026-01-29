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
    console.log('PersonaRepositoryAzure inicializado');
  }

  private dtoToEntity(dto: any): Persona {
    console.log('DTO recibido RAW:', JSON.stringify(dto, null, 2));
    
    // Extraer el objeto persona si viene anidado
    const personaData = dto.persona || dto;
    
    console.log('Datos de persona extraídos:', personaData);
    
    const id = personaData.id || personaData.ID || personaData.Id || 0;
    const nombre = personaData.nombre || personaData.Nombre || '';
    const apellidos = personaData.apellidos || personaData.Apellidos || '';
    const foto = personaData.foto || personaData.Foto || '';
    const direccion = personaData.direccion || personaData.Direccion || '';
    const telefono = personaData.telefono || personaData.Telefono || '';
    const idDepartamento = personaData.idDepartamento || personaData.IDDepartamento || personaData.IdDepartamento || 0;
    
    let fechaNacimiento: Date;
    const fechaDto = personaData.fechaNacimiento || personaData.FechaNacimiento;
    
    if (fechaDto) {
      fechaNacimiento = new Date(fechaDto);
      // Si la fecha es inválida, usar fecha por defecto
      if (isNaN(fechaNacimiento.getTime())) {
        console.warn('Fecha inválida, usando fecha por defecto:', fechaDto);
        fechaNacimiento = new Date('2000-01-01');
      }
    } else {
      console.warn('Fecha null, usando fecha por defecto');
      fechaNacimiento = new Date('2000-01-01');
    }
    
    console.log('Valores extraídos:', {
      id,
      nombre,
      apellidos,
      foto,
      fechaNacimiento: fechaNacimiento.toISOString(),
      direccion,
      telefono,
      idDepartamento
    });
    
    if (!id || id === 0) {
      console.error('DTO sin ID válido. Datos de persona:', personaData);
      throw new Error('Persona sin ID válido');
    }
    
    const persona = new Persona(
      id,
      nombre,
      apellidos,
      foto,
      fechaNacimiento,
      direccion,
      telefono,
      idDepartamento
    );
    
    console.log('Persona convertida:', {
      id: persona.id,
      nombreCompleto: persona.getNombreCompleto(),
      edad: persona.getEdad()
    });
    
    return persona;
  }

  private entityToDto(persona: Persona): PersonaDTO {
    console.log('Convirtiendo Entidad a DTO:', persona.getNombreCompleto());
    
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
    
    console.log('DTO creado:', dto);
    return dto;
  }

  public async getListaPersonas(): Promise<Persona[]> {
    console.log('Repository: Obteniendo lista de personas...');
    
    try {
      const dtos = await this._api.get<any[]>('/personas');
      console.log(`Repository: ${dtos.length} items obtenidos de la API`);
      
      if (dtos.length > 0) {
        console.log('Estructura del primer item:', JSON.stringify(dtos[0], null, 2));
      }
      
      // Procesar cada item
      const personasValidas: Persona[] = [];
      
      dtos.forEach((dto, index) => {
        try {
          // Extraer el objeto persona si viene anidado
          const personaData = dto.persona || dto;
          const id = personaData.id || personaData.ID || personaData.Id;
          
          if (!id || id === 0) {
            console.warn(`⚠️ Saltando registro sin ID en posición ${index}. Item completo:`, dto);
            return;
          }
          
          const persona = this.dtoToEntity(dto);
          personasValidas.push(persona);
          console.log(`Persona ${index} procesada: ${persona.getNombreCompleto()}`);
        } catch (error) {
          console.error(`Error al procesar persona en posición ${index}:`, error);
          console.error('Item que causó el error:', dto);
        }
      });
      
      console.log(`Repository: ${personasValidas.length} personas válidas convertidas a entidades`);
      
      return personasValidas;
    } catch (error) {
      console.error('Repository: Error al obtener lista de personas:', error);
      throw error;
    }
  }

  public async getPersonaPorId(idPersona: number): Promise<Persona> {
  console.log(`Repository: Obteniendo persona con ID ${idPersona}...`);
  
  try {

    let dto = await this._api.get<any>(`/personas/${idPersona}`);
    console.log(`Repository: Respuesta de la API:`, dto);
    
    // Si devuelve texto plano "value" o string, intenta parsearlo
    if (typeof dto === 'string') {
      console.log('La API devolvió texto plano:', dto);
      
      // Intenta obtener del endpoint de listado y filtrar
      console.log('Intentando obtener del listado completo...');
      const lista = await this._api.get<any[]>('/personas');
      
      const personaEncontrada = lista.find(item => {
        const personaData = item.persona || item;
        return personaData.id === idPersona || personaData.ID === idPersona;
      });
      
      if (!personaEncontrada) {
        throw new Error(`Persona con ID ${idPersona} no encontrada`);
      }
      
      dto = personaEncontrada;
      console.log('Persona encontrada en el listado:', dto);
    }
    
    const persona = this.dtoToEntity(dto);
    return persona;
  } catch (error) {
    console.error(`Repository: Error al obtener persona ${idPersona}:`, error);
    throw error;
  }
}

  public async crearPersona(personaNueva: Persona): Promise<number> {
  console.log('Repository: Creando nueva persona...');
  
  try {
    const dto = this.entityToDto(personaNueva);
    
    const { id, ...dtoSinId } = dto;
    
    console.log('DTO sin ID para POST:', dtoSinId);
    
    const response = await this._api.post<{ id: number }>('/personas', dtoSinId);
    console.log(`Repository: Persona creada con ID ${response.id}`);
    
    return response.id;
  } catch (error) {
    console.error('Repository: Error al crear persona:', error);
    throw error;
  }
}

  public async actualizarPersona(idPersona: number, persona: Persona): Promise<number> {
  console.log(`🔄 Repository: Actualizando persona ${idPersona}...`);
  
  try {
    const dto = this.entityToDto(persona);
    
    // Asegurar que el ID del DTO coincida con el ID de la URL
    dto.id = idPersona;
    
    console.log('DTO con ID corregido:', dto);
    
    await this._api.put<void>(`/personas/${idPersona}`, dto);
    console.log(`Repository: Persona ${idPersona} actualizada`);
    
    return idPersona;
  } catch (error) {
    console.error(`Repository: Error al actualizar persona ${idPersona}:`, error);
    throw error;
  }
}

  public async eliminarPersona(idPersona: number): Promise<number> {
    console.log(`Repository: Eliminando persona ${idPersona}...`);
    
    try {
      await this._api.delete<void>(`/personas/${idPersona}`);
      console.log(`Repository: Persona ${idPersona} eliminada`);
      
      return idPersona;
    } catch (error) {
      console.error(`Repository: Error al eliminar persona ${idPersona}:`, error);
      throw error;
    }
  }
}
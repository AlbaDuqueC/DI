// app/data/Repository/PersonaRepositoryAzure.ts
// SOLUCIÓN DEFINITIVA: Usar nombres de propiedades como los espera la API C#

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
    
    // La API puede devolver datos anidados o directos
    const personaData = dto.persona || dto;
    
    // ✅ IMPORTANTE: La API usa nombres con mayúsculas (ID, Nombre, etc.)
    const id = personaData.ID || personaData.id || personaData.Id || 0;
    const nombre = personaData.Nombre || personaData.nombre || '';
    const apellidos = personaData.Apellidos || personaData.apellidos || '';
    const foto = personaData.Foto || personaData.foto || '';
    const direccion = personaData.Direccion || personaData.direccion || '';
    const telefono = personaData.Telefono || personaData.telefono || '';
    const idDepartamento = personaData.IdDepartamento || personaData.IDDepartamento || personaData.idDepartamento || 0;
    
    let fechaNacimiento: Date;
    const fechaDto = personaData.FechaNacimiento || personaData.fechaNacimiento;
    
    if (fechaDto) {
      fechaNacimiento = new Date(fechaDto);
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

  private entityToDto(persona: Persona, idPersona?: number): PersonaDTO {
    console.log('Convirtiendo Entidad a DTO:', persona.getNombreCompleto());
    
    // ✅ SOLUCIÓN: Usar nombres con MAYÚSCULAS como los espera la API C#
    const dto: PersonaDTO = {
      ID: idPersona !== undefined ? idPersona : persona.id,  // ← ID en mayúsculas
      Nombre: persona.nombre,  // ← Nombre con N mayúscula
      Apellidos: persona.apellidos,  // ← Apellidos con A mayúscula
      Foto: persona.foto,  // ← Foto con F mayúscula
      FechaNacimiento: persona.fechaNacimiento.toISOString(),  // ← FechaNacimiento
      Direccion: persona.direccion,  // ← Direccion con D mayúscula
      Telefono: persona.telefono,  // ← Telefono con T mayúscula
      IdDepartamento: persona.idDepartamento  // ← IdDepartamento
    };
    
    console.log('DTO creado con nombres C#:', dto);
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
      
      const personasValidas: Persona[] = [];
      
      dtos.forEach((dto, index) => {
        try {
          const personaData = dto.persona || dto;
          const id = personaData.ID || personaData.id || personaData.Id;
          
          if (!id || id === 0) {
            console.warn(`Saltando registro sin ID en posición ${index}`);
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
      
      if (typeof dto === 'string') {
        console.log('La API devolvió texto plano, buscando en listado...');
        const lista = await this._api.get<any[]>('/personas');
        
        const personaEncontrada = lista.find(item => {
          const personaData = item.persona || item;
          return personaData.ID === idPersona || personaData.id === idPersona;
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
      // Para crear, NO enviamos el ID
      const dto = this.entityToDto(personaNueva);
      
      // Eliminar el ID para POST
      const { ID, ...dtoSinId } = dto;
      
      console.log('DTO sin ID para POST:', dtoSinId);
      
      const response = await this._api.post<{ id: number; ID: number }>('/personas', dtoSinId);
      
      // La respuesta puede venir con 'id' o 'ID'
      const nuevoId = response.ID || response.id;
      console.log(`Repository: Persona creada con ID ${nuevoId}`);
      
      return nuevoId;
    } catch (error) {
      console.error('Repository: Error al crear persona:', error);
      throw error;
    }
  }

  public async actualizarPersona(idPersona: number, persona: Persona): Promise<number> {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🔄 Repository: Actualizando persona ${idPersona}...`);
    console.log('='.repeat(70));
    
    try {
      // ✅ SOLUCIÓN: Pasar el idPersona al método entityToDto para que use ese ID
      const dto = this.entityToDto(persona, idPersona);
      
      console.log('\n📤 DTO que se enviará a la API (con nombres C#):');
      console.log(JSON.stringify(dto, null, 2));
      console.log(`\n📍 URL: PUT /personas/${idPersona}`);
      console.log('\n✔️ Verificación:');
      console.log(`  - ID en URL: ${idPersona}`);
      console.log(`  - ID en DTO: ${dto.ID}`);
      console.log(`  - ¿Coinciden? ${idPersona === dto.ID ? '✅ SÍ' : '❌ NO'}`);
      
      await this._api.put<void>(`/personas/${idPersona}`, dto);
      
      console.log('\n✅ Repository: Persona actualizada exitosamente');
      console.log('='.repeat(70) + '\n');
      
      return idPersona;
    } catch (error) {
      console.error('\n❌ Repository: Error al actualizar persona:', error);
      console.error('='.repeat(70) + '\n');
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
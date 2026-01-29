import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IDepartamentoRepository } from '../../domain/interfaces/Repository/IDepartamentoRepository';
import { Departamento } from '../../domain/entities/Departamento';
import { DepartamentoDTO } from '../../domain/dto/DepartamentoDTO';
import { AzureAPI } from '../datasource/AzureAPI';
import { TYPES } from '../../core/types';

// Decorador que marca la clase como inyectable en el contenedor de dependencias
@injectable()
export class DepartamentoRepositoryAzure implements IDepartamentoRepository {
  // Propiedad privada de solo lectura que almacena la instancia de la API de Azure
  private readonly _api: AzureAPI;

  // Constructor que recibe la instancia de AzureAPI mediante inyección de dependencias
  constructor(
    // Decorador que especifica qué tipo debe ser inyectado desde el contenedor
    @inject(TYPES.AzureAPI) api: AzureAPI
  ) {
    // Asigna la instancia de la API recibida a la propiedad privada
    this._api = api;
  }

  // Método privado que convierte un objeto DTO en una entidad de dominio Departamento
  private dtoToEntity(dto: DepartamentoDTO): Departamento {
    // Crea y retorna una nueva instancia de Departamento con los datos del DTO
    return new Departamento(dto.id, dto.nombre);
  }

  // Método privado que convierte una entidad Departamento en un objeto DTO
  private entityToDto(departamento: Departamento): DepartamentoDTO {
    // Retorna un objeto plano con las propiedades del departamento
    return {
      id: departamento.id,
      nombre: departamento.nombre
    };
  }

  // Método público asíncrono que obtiene la lista completa de departamentos
  public async getListaDepartamentos(): Promise<Departamento[]> {
    try {
      // Realiza una petición GET a la API para obtener todos los departamentos como DTOs
      const dtos = await this._api.get<DepartamentoDTO[]>('/departamentos');
      // Transforma cada DTO en una entidad de dominio y retorna el array resultante
      return dtos.map(dto => this.dtoToEntity(dto));
    } catch (error) {
      // Registra el error en la consola para diagnóstico
      console.error('Error al obtener lista de departamentos:', error);
      // Propaga el error al llamador
      throw error;
    }
  }

  // Método público asíncrono que obtiene un departamento específico por su ID
  public async getDepartamentoPorId(idDepartamento: number): Promise<Departamento> {
    try {
      // Realiza una petición GET a la API para obtener el departamento específico
      const dto = await this._api.get<DepartamentoDTO>(`/departamentos/${idDepartamento}`);
      // Convierte el DTO recibido en una entidad de dominio
      return this.dtoToEntity(dto);
    } catch (error) {
      // Registra el error en la consola
      console.error('Error al obtener departamento por ID:', error);
      // Propaga el error
      throw error;
    }
  }

  // Método público asíncrono que crea un nuevo departamento en la base de datos
  public async crearDepartamento(departamentoNuevo: Departamento): Promise<number> {
    try {
      // Convierte la entidad de dominio en un DTO para enviarlo a la API
      const dto = this.entityToDto(departamentoNuevo);
      // Envía una petición POST a la API con los datos del departamento
      const response = await this._api.post<{ id: number }>('/departamentos', dto);
      // Retorna el ID del departamento recién creado
      return response.id;
    } catch (error) {
      // Registra el error en la consola
      console.error('Error al crear departamento:', error);
      // Propaga el error
      throw error;
    }
  }

  // Método público asíncrono que actualiza un departamento existente
  public async actualizarDepartamento(idDepartamento: number, departamento: Departamento): Promise<number> {
    try {
      // Convierte la entidad actualizada en un DTO
      const dto = this.entityToDto(departamento);
      // Envía una petición PUT a la API para actualizar el departamento
      await this._api.put<void>(`/departamentos/${idDepartamento}`, dto);
      // Retorna el ID del departamento actualizado
      return idDepartamento;
    } catch (error) {
      // Registra el error en la consola
      console.error('Error al actualizar departamento:', error);
      // Propaga el error
      throw error;
    }
  }

  // Método público asíncrono que elimina un departamento de la base de datos
  public async eliminarDepartamento(idDepartamento: number): Promise<number> {
    try {
      // Envía una petición DELETE a la API para eliminar el departamento
      await this._api.delete<void>(`/departamentos/${idDepartamento}`);
      // Retorna el ID del departamento eliminado
      return idDepartamento;
    } catch (error) {
      // Registra el error en la consola
      console.error('Error al eliminar departamento:', error);
      // Propaga el error
      throw error;
    }
  }

  // Método público asíncrono que cuenta cuántas personas están asignadas a un departamento
  public async contarPersonasDepartamento(idDepartamento: number): Promise<number> {
    try {
      // Realiza una petición GET a un endpoint específico que retorna el conteo
      const response = await this._api.get<{ count: number }>(`/departamentos/${idDepartamento}/personas/count`);
      // Retorna el número de personas asignadas al departamento
      return response.count;
    } catch (error) {
      // Registra el error en la consola
      console.error('Error al contar personas del departamento:', error);
      // Propaga el error
      throw error;
    }
  }
}
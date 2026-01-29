import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IDepartamentoUseCase } from '../interfaces/UseCase/IDepartamentoUseCase';
import { IDepartamentoRepository } from '../interfaces/Repository/IDepartamentoRepository';
import { Departamento } from '../entities/Departamento';
import { TYPES } from '../../core/types';

// Decorador que marca la clase como inyectable en el contenedor de dependencias
@injectable()
export class DepartamentoUseCase implements IDepartamentoUseCase {
  // Propiedad privada de solo lectura que almacena la instancia del repositorio
  private readonly _repository: IDepartamentoRepository;

  // Constructor que recibe el repositorio mediante inyección de dependencias
  constructor(
    // Decorador que especifica qué tipo debe ser inyectado
    @inject(TYPES.IDepartamentoRepository) repository: IDepartamentoRepository
  ) {
    // Asigna el repositorio recibido a la propiedad privada
    this._repository = repository;
  }

  // Método público que obtiene todos los departamentos
  public async getDepartamentos(): Promise<Departamento[]> {
    try {
      // Delega la operación al repositorio y retorna el resultado
      return await this._repository.getListaDepartamentos();
    } catch (error) {
      // Registra el error en la consola
      console.error('Error en getDepartamentos:', error);
      // Propaga el error al llamador
      throw error;
    }
  }

  // Método público que obtiene un departamento específico por su ID
  public async getDepartamentoById(id: number): Promise<Departamento> {
    try {
      // Delega la operación al repositorio
      return await this._repository.getDepartamentoPorId(id);
    } catch (error) {
      // Registra el error
      console.error('Error en getDepartamentoById:', error);
      // Propaga el error
      throw error;
    }
  }

  // Método público que crea un nuevo departamento
  public async crearDepartamento(departamento: Departamento): Promise<number> {
    try {
      // Delega la creación al repositorio
      return await this._repository.crearDepartamento(departamento);
    } catch (error) {
      // Registra el error
      console.error('Error en crearDepartamento:', error);
      // Propaga el error
      throw error;
    }
  }

  // Método público que actualiza un departamento existente
  public async actualizarDepartamento(id: number, departamento: Departamento): Promise<number> {
    try {
      // Delega la actualización al repositorio
      return await this._repository.actualizarDepartamento(id, departamento);
    } catch (error) {
      // Registra el error
      console.error('Error en actualizarDepartamento:', error);
      // Propaga el error
      throw error;
    }
  }

  // Método público que elimina un departamento verificando primero si tiene personas asignadas
  public async eliminarDepartamento(id: number): Promise<number> {
    try {
      // Obtiene el número de personas asignadas al departamento
      const count = await this._repository.contarPersonasDepartamento(id);
      
      // Verifica si hay personas asignadas
      if (count > 0) {
        // Lanza un error si el departamento tiene personas, impidiendo la eliminación
        throw new Error(`No se puede eliminar el departamento porque tiene ${count} persona(s) asignada(s)`);
      }

      // Si no hay personas asignadas, procede con la eliminación
      return await this._repository.eliminarDepartamento(id);
    } catch (error) {
      // Registra el error
      console.error('Error en eliminarDepartamento:', error);
      // Propaga el error
      throw error;
    }
  }
}
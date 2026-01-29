// app/presentation/viewModel/DepartamentoVM.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import 'reflect-metadata';
import { IDepartamentoUseCase } from '../../domain/interfaces/UseCase/IDepartamentoUseCase';
import { DepartamentoModel } from '../model/DepartamentoModel';
import { Departamento } from '../../domain/entities/Departamento';
import { TYPES } from '../../core/types';

// Decorador que marca la clase como inyectable en el contenedor de dependencias
@injectable()
export class DepartamentosVM {
  // Propiedad privada que almacena la instancia del caso de uso de departamentos
  private readonly _useCase: IDepartamentoUseCase;
  
  // Propiedad observable que almacena la lista de modelos de departamentos para la UI
  @observable
  private _departamentos: DepartamentoModel[] = [];
  
  // Propiedad observable que indica si hay una operación en curso
  @observable
  private _isLoading: boolean = false;
  
  // Propiedad observable que almacena mensajes de error
  @observable
  private _error: string | null = null;
  
  // Propiedad observable que almacena el texto de búsqueda/filtro
  @observable
  private _filtro: string = '';
  
  // Propiedad observable que almacena el departamento seleccionado actualmente
  @observable
  private _departamentoSeleccionado: DepartamentoModel | null = null;

  // Constructor que recibe el caso de uso mediante inyección de dependencias
  constructor(
    @inject(TYPES.IDepartamentoUseCase) useCase: IDepartamentoUseCase
  ) {
    // Asigna el caso de uso a la propiedad privada
    this._useCase = useCase;
    // Hace que las propiedades observables de MobX sean reactivas
    makeObservable(this);
  }

  // Getter computado que retorna los departamentos filtrados según el texto de búsqueda
  @computed
  get departamentos(): DepartamentoModel[] {
    // Si no hay texto de filtro, retorna todos los departamentos
    if (!this._filtro) {
      return this._departamentos;
    }
    
    // Filtra los departamentos cuyo nombre incluya el texto de búsqueda (case-insensitive)
    return this._departamentos.filter(dept =>
      dept.nombre.toLowerCase().includes(this._filtro.toLowerCase())
    );
  }

  // Getter que retorna el estado de carga
  get isLoading(): boolean {
    return this._isLoading;
  }

  // Getter que retorna el mensaje de error actual
  get error(): string | null {
    return this._error;
  }

  // Getter que retorna el texto del filtro actual
  get filtro(): string {
    return this._filtro;
  }

  // Getter que retorna el departamento seleccionado
  get departamentoSeleccionado(): DepartamentoModel | null {
    return this._departamentoSeleccionado;
  }

  // Action de MobX que actualiza el texto del filtro
  @action
  public setFiltro(texto: string): void {
    this._filtro = texto;
  }

  // Action de MobX que establece el departamento seleccionado
  @action
  public setDepartamentoSeleccionado(departamento: DepartamentoModel | null): void {
    this._departamentoSeleccionado = departamento;
  }

  // Método privado que convierte una entidad de dominio en un modelo para la UI
  private entityToModel(entity: Departamento): DepartamentoModel {
    return new DepartamentoModel(entity.id, entity.nombre);
  }

  // Action asíncrono que carga todos los departamentos desde el caso de uso
  @action
  public async cargarDepartamentos(): Promise<void> {
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia cualquier error previo
    this._error = null;
    
    try {
      // Obtiene los departamentos del caso de uso
      const entities = await this._useCase.getDepartamentos();
      // Convierte las entidades en modelos y actualiza la lista observable
      runInAction(() => {
        this._departamentos = entities.map(entity => this.entityToModel(entity));
      });
    } catch (error) {
      // Actualiza el estado de error si algo falla
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al cargar departamentos';
      });
    } finally {
      // Desactiva el indicador de carga independientemente del resultado
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  // Action asíncrono que elimina un departamento y actualiza la lista
  @action
  public async eliminarDepartamento(id: number): Promise<void> {
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Llama al caso de uso para eliminar el departamento
      await this._useCase.eliminarDepartamento(id);
      // Recarga la lista de departamentos después de la eliminación
      await this.cargarDepartamentos();
    } catch (error) {
      // Actualiza el estado de error
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al eliminar departamento';
      });
      // Propaga el error para que pueda ser manejado por la UI
      throw error;
    } finally {
      // Desactiva el indicador de carga
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}
// app/presentation/viewModel/EditarInsertarDepartamentoVM.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import 'reflect-metadata';
import { IDepartamentoUseCase } from '../../domain/interfaces/UseCase/IDepartamentoUseCase';
import { Departamento } from '../../domain/entities/Departamento';
import { TYPES } from '../../core/types';

// Decorador que marca la clase como inyectable
@injectable()
export class EditarInsertarDepartamentoVM {
  // Propiedad privada que almacena el caso de uso
  private readonly _useCase: IDepartamentoUseCase;
  
  // Propiedad observable que almacena el ID del departamento (0 para nuevo)
  @observable
  private _id: number = 0;
  
  // Propiedad observable que almacena el nombre del departamento
  @observable
  private _nombre: string = '';
  
  // Propiedad observable que indica si está en modo edición
  @observable
  private _isEditMode: boolean = false;
  
  // Propiedad observable que indica si hay una operación en curso
  @observable
  private _isLoading: boolean = false;
  
  // Propiedad observable que almacena mensajes de error
  @observable
  private _error: string | null = null;

  // Constructor que recibe el caso de uso mediante inyección de dependencias
  constructor(
    @inject(TYPES.IDepartamentoUseCase) useCase: IDepartamentoUseCase
  ) {
    this._useCase = useCase;
    // Hace que las propiedades sean reactivas
    makeObservable(this);
  }

  // Getter que retorna el ID del departamento
  get id(): number {
    return this._id;
  }

  // Getter que retorna el nombre del departamento
  get nombre(): string {
    return this._nombre;
  }

  // Getter que indica si está en modo edición
  get isEditMode(): boolean {
    return this._isEditMode;
  }

  // Getter que retorna el estado de carga
  get isLoading(): boolean {
    return this._isLoading;
  }

  // Getter que retorna el mensaje de error
  get error(): string | null {
    return this._error;
  }

  // Action que actualiza el nombre del departamento
  @action
  public setNombre(nombre: string): void {
    this._nombre = nombre;
    // Limpia el error cuando el usuario empieza a escribir
    this._error = null;
  }

  // Action asíncrono que carga los datos de un departamento existente
  @action
  public async cargarDepartamento(id: number): Promise<void> {
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Obtiene el departamento del caso de uso
      const departamento = await this._useCase.getDepartamentoById(id);
      // Actualiza el estado con los datos del departamento
      runInAction(() => {
        this._id = departamento.id;
        this._nombre = departamento.nombre;
        this._isEditMode = true;
      });
    } catch (error) {
      // Actualiza el estado de error
      runInAction(() => {
        this._error = 'Error al cargar el departamento';
      });
    } finally {
      // Desactiva el indicador de carga
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  // Action que limpia el formulario para crear un nuevo departamento
  @action
  public limpiarFormulario(): void {
    this._id = 0;
    this._nombre = '';
    this._isEditMode = false;
    this._error = null;
  }

  // Action asíncrono que guarda el departamento (crea o actualiza según el modo)
  @action
  public async guardarDepartamento(): Promise<void> {
    // Valida que el nombre no esté vacío
    if (!this._nombre.trim()) {
      this._error = 'El nombre del departamento es obligatorio';
      return;
    }

    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Crea una instancia de la entidad Departamento
      const departamento = new Departamento(this._id, this._nombre);
      
      // Decide si crear o actualizar según el modo
      if (this._isEditMode) {
        // Actualiza el departamento existente
        await this._useCase.actualizarDepartamento(this._id, departamento);
      } else {
        // Crea un nuevo departamento
        await this._useCase.crearDepartamento(departamento);
      }
    } catch (error) {
      // Actualiza el estado de error
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al guardar';
      });
      // Propaga el error para que la UI pueda manejarlo
      throw error;
    } finally {
      // Desactiva el indicador de carga
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}
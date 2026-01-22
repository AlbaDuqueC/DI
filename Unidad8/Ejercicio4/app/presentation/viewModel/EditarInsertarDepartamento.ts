// src/presentation/viewmodels/departamentos/EditarInsertarDepartamentoVM.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed } from 'mobx';
import 'reflect-metadata';
import { IDepartamentoUseCase } from '../../domain/interfaces/UseCase/IDepartamentoUseCase';
import { Departamento } from '../../domain/entities/Departamento';
import { TYPES } from '../../core/types';

@injectable()
export class EditarInsertarDepartamentoVM {
  @observable private _id: number = 0;
  @observable private _nombre: string = '';
  @observable private _isLoading: boolean = false;
  @observable private _error: string | null = null;
  @observable private _isEditMode: boolean = false;

  private readonly _departamentoUseCase: IDepartamentoUseCase;

  static injectable=[TYPES.IDepartamentoUseCase];

  constructor( departamentoUseCase: IDepartamentoUseCase) {
    this._departamentoUseCase = departamentoUseCase;
    makeObservable(this);
  }

  // Getters
  @computed get id(): number { return this._id; }
  @computed get nombre(): string { return this._nombre; }
  @computed get isLoading(): boolean { return this._isLoading; }
  @computed get error(): string | null { return this._error; }
  @computed get isEditMode(): boolean { return this._isEditMode; }

  // Setters
  @action setNombre(value: string): void { this._nombre = value; }

  @action
  public async cargarDepartamento(id: number): Promise<void> {
    this._isLoading = true;
    this._error = null;
    this._isEditMode = true;
    
    try {
      const departamento = await this._departamentoUseCase.getDepartamentoById(id);
      this._id = departamento.id;
      this._nombre = departamento.nombre;
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Error al cargar departamento';
      console.error('Error al cargar departamento:', error);
    } finally {
      this._isLoading = false;
    }
  }

  @action
  public limpiarFormulario(): void {
    this._id = 0;
    this._nombre = '';
    this._error = null;
    this._isEditMode = false;
  }

  @action
  public async guardarDepartamento(): Promise<number> {
    this._isLoading = true;
    this._error = null;

    try {
      // Validaciones
      if (!this._nombre) {
        throw new Error('El nombre del departamento es obligatorio');
      }

      const departamento = new Departamento(this._id, this._nombre);

      let resultado: number;
      if (this._isEditMode) {
        resultado = await this._departamentoUseCase.actualizarDepartamento(this._id, departamento);
      } else {
        resultado = await this._departamentoUseCase.crearDepartamento(departamento);
      }

      return resultado;
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Error al guardar departamento';
      console.error('Error al guardar departamento:', error);
      throw error;
    } finally {
      this._isLoading = false;
    }
  }
}
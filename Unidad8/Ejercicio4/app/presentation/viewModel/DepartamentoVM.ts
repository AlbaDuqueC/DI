// app/presentation/viewModel/DepartamentoVM.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed } from 'mobx';
import 'reflect-metadata';
import { IDepartamentoUseCase } from '../../domain/interfaces/UseCase/IDepartamentoUseCase';
import { DepartamentoModel } from '../model/DepartamentoModel';
import { Departamento } from '../../domain/entities/Departamento';
import { TYPES } from '../../core/types';

@injectable()
export class DepartamentosVM {
  @observable private _departamentos: DepartamentoModel[] = [];
  @observable private _departamentoSeleccionado: DepartamentoModel | null = null;
  @observable private _isLoading: boolean = false;
  @observable private _error: string | null = null;
  @observable private _filtro: string = '';

  private readonly _departamentoUseCase: IDepartamentoUseCase;


  
  constructor(@inject(TYPES.IDepartamentoUseCase) departamentoUseCase: IDepartamentoUseCase) {
    this._departamentoUseCase = departamentoUseCase;
    makeObservable(this);
  }

  @computed
  public get departamentos(): DepartamentoModel[] {
    if (!this._filtro) {
      return this._departamentos;
    }
    
    const filtroLower = this._filtro.toLowerCase();
    return this._departamentos.filter(d => 
      d.nombre.toLowerCase().includes(filtroLower)
    );
  }

  @computed
  public get departamentoSeleccionado(): DepartamentoModel | null {
    return this._departamentoSeleccionado;
  }

  @computed
  public get isLoading(): boolean {
    return this._isLoading;
  }

  @computed
  public get error(): string | null {
    return this._error;
  }

  @computed
  public get filtro(): string {
    return this._filtro;
  }

  @action
  public setFiltro(filtro: string): void {
    this._filtro = filtro;
  }

  @action
  public setDepartamentoSeleccionado(departamento: DepartamentoModel | null): void {
    this._departamentoSeleccionado = departamento;
  }

  @action
  public async cargarDepartamentos(): Promise<void> {
    this._isLoading = true;
    this._error = null;
    
    try {
      const departamentos = await this._departamentoUseCase.getDepartamentos();
      this._departamentos = departamentos.map(d => this.entityToViewModel(d));
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Error al cargar departamentos';
      console.error('Error al cargar departamentos:', error);
    } finally {
      this._isLoading = false;
    }
  }

  @action
  public async eliminarDepartamento(id: number): Promise<void> {
    this._isLoading = true;
    this._error = null;
    
    try {
      await this._departamentoUseCase.eliminarDepartamento(id);
      await this.cargarDepartamentos(); // Recargar la lista
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Error al eliminar departamento';
      console.error('Error al eliminar departamento:', error);
      throw error;
    } finally {
      this._isLoading = false;
    }
  }

  private entityToViewModel(departamento: Departamento): DepartamentoModel {
    return new DepartamentoModel(
      departamento.id,
      departamento.nombre
    );
  }
}
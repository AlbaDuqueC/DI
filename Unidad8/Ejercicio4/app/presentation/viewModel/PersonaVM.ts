// app/presentation/viewModel/PersonaVM.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed } from 'mobx';
import 'reflect-metadata';
import { IPersonaUseCase } from '../../domain/interfaces/UseCase/IPersonaUseCase';
import { PersonaModel } from '../model/PersonaModel';
import { Persona } from '../../domain/entities/Persona';
import { TYPES } from '../../core/types';

@injectable()
export class PersonasVM {
  @observable private _personas: PersonaModel[] = [];
  @observable private _personaSeleccionada: PersonaModel | null = null;
  @observable private _isLoading: boolean = false;
  @observable private _error: string | null = null;
  @observable private _filtro: string = '';

  private readonly _personaUseCase: IPersonaUseCase;

  constructor(
    // ⚠️ CORRECCIÓN: Usar TYPES.IPersonaUseCase para coincidir con el Container
    @inject(TYPES.IPersonaUseCase) personaUseCase: IPersonaUseCase
  ) {
    this._personaUseCase = personaUseCase;
    makeObservable(this);
  }

  @computed
  public get personas(): PersonaModel[] {
    if (!this._filtro) {
      return this._personas;
    }
    
    const filtroLower = this._filtro.toLowerCase();
    return this._personas.filter(p => 
      p.nombreCompleto.toLowerCase().includes(filtroLower) ||
      p.telefono.includes(filtroLower) ||
      p.direccion.toLowerCase().includes(filtroLower)
    );
  }

  @computed
  public get personaSeleccionada(): PersonaModel | null {
    return this._personaSeleccionada;
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
  public setPersonaSeleccionada(persona: PersonaModel | null): void {
    this._personaSeleccionada = persona;
  }

  @action
  public async cargarPersonas(): Promise<void> {
    this._isLoading = true;
    this._error = null;
    
    try {
      const personas = await this._personaUseCase.getPersonas();
      this._personas = personas.map(p => this.entityToViewModel(p));
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Error al cargar personas';
      console.error('Error al cargar personas:', error);
    } finally {
      this._isLoading = false;
    }
  }

  @action
  public async eliminarPersona(id: number): Promise<void> {
    this._isLoading = true;
    this._error = null;
    
    try {
      await this._personaUseCase.eliminarPersona(id);
      await this.cargarPersonas(); // Recargar la lista
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Error al eliminar persona';
      console.error('Error al eliminar persona:', error);
      throw error;
    } finally {
      this._isLoading = false;
    }
  }

  private entityToViewModel(persona: Persona): PersonaModel {
    return new PersonaModel(
      persona.id,
      persona.nombre,
      persona.apellidos,
      persona.foto,
      persona.fechaNacimiento,
      persona.direccion,
      persona.telefono,
      persona.idDepartamento,
      persona.getEdad()
    );
  }
}
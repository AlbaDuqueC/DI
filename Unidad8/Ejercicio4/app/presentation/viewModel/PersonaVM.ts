// app/presentation/viewModel/PersonaVM.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import 'reflect-metadata';
import { IPersonaUseCase } from '../../domain/interfaces/UseCase/IPersonaUseCase';
import { PersonaModel } from '../model/PersonaModel';
import { Persona } from '../../domain/entities/Persona';
import { TYPES } from '../../core/types';

// Decorador que marca la clase como inyectable
@injectable()
export class PersonasVM {
  // Propiedad privada que almacena el caso de uso de personas
  private readonly _useCase: IPersonaUseCase;
  
  // Propiedad observable que almacena la lista de modelos de personas para la UI
  @observable
  private _personas: PersonaModel[] = [];
  
  // Propiedad observable que indica si hay una operación en curso
  @observable
  private _isLoading: boolean = false;
  
  // Propiedad observable que almacena mensajes de error
  @observable
  private _error: string | null = null;
  
  // Propiedad observable que almacena el texto de búsqueda
  @observable
  private _filtro: string = '';
  
  // Propiedad observable que almacena la persona seleccionada
  @observable
  private _personaSeleccionada: PersonaModel | null = null;

  // Constructor que recibe el caso de uso mediante inyección de dependencias
  constructor(
    @inject(TYPES.IPersonaUseCase) useCase: IPersonaUseCase
  ) {
    this._useCase = useCase;
    // Hace que las propiedades sean reactivas
    makeObservable(this);
  }

  // Getter computado que retorna las personas filtradas por el texto de búsqueda
  @computed
  get personas(): PersonaModel[] {
    // Registra en consola para debugging
    console.log('Getter personas llamado. Personas:', this._personas.length);
    
    // Si no hay filtro, retorna todas las personas
    if (!this._filtro) {
      return this._personas;
    }
    
    // Filtra personas cuyo nombre completo incluya el texto de búsqueda
    return this._personas.filter(persona =>
      persona.nombreCompleto.toLowerCase().includes(this._filtro.toLowerCase())
    );
  }

  // Getter que retorna el estado de carga
  get isLoading(): boolean {
    return this._isLoading;
  }

  // Getter que retorna el mensaje de error
  get error(): string | null {
    return this._error;
  }

  // Getter que retorna el texto del filtro
  get filtro(): string {
    return this._filtro;
  }

  // Getter que retorna la persona seleccionada
  get personaSeleccionada(): PersonaModel | null {
    return this._personaSeleccionada;
  }

  // Action que actualiza el texto del filtro
  @action
  public setFiltro(texto: string): void {
    this._filtro = texto;
  }

  // Action que establece la persona seleccionada
  @action
  public setPersonaSeleccionada(persona: PersonaModel | null): void {
    this._personaSeleccionada = persona;
  }

  // Método privado que convierte una entidad de dominio en un modelo para la UI
  private entityToModel(entity: Persona): PersonaModel {
    return new PersonaModel(
      entity.id,
      entity.nombre,
      entity.apellidos,
      entity.foto,
      entity.fechaNacimiento,
      entity.direccion,
      entity.telefono,
      entity.idDepartamento,
      entity.getEdad()
    );
  }

  // Action asíncrono que carga todas las personas desde el caso de uso
  @action
  public async cargarPersonas(): Promise<void> {
    // Registra el inicio de la carga
    console.log('ViewModel: Iniciando carga de personas...');
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Obtiene las personas del caso de uso
      console.log('ViewModel: Llamando al UseCase...');
      const entities = await this._useCase.getPersonas();
      console.log('ViewModel: Personas recibidas del UseCase:', entities.length);
      
      // Convierte las entidades en modelos y actualiza el estado
      runInAction(() => {
        this._personas = entities.map(entity => {
          // Registra cada conversión
          console.log('Convirtiendo entidad a modelo:', entity.getNombreCompleto());
          return this.entityToModel(entity);
        });
        console.log('ViewModel: Modelos creados:', this._personas.length);
      });
    } catch (error) {
      // Registra y actualiza el estado de error
      console.error('ViewModel: Error al cargar personas:', error);
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al cargar personas';
      });
    } finally {
      // Desactiva el indicador de carga
      runInAction(() => {
        this._isLoading = false;
        console.log('ViewModel: Carga finalizada. Estado final:', {
          personas: this._personas.length,
          error: this._error
        });
      });
    }
  }

  // Action asíncrono que elimina una persona y recarga la lista
  @action
  public async eliminarPersona(id: number): Promise<void> {
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Llama al caso de uso para eliminar
      await this._useCase.eliminarPersona(id);
      // Recarga la lista después de eliminar
      await this.cargarPersonas();
    } catch (error) {
      // Actualiza el estado de error
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al eliminar persona';
      });
      // Propaga el error
      throw error;
    } finally {
      // Desactiva el indicador de carga
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}
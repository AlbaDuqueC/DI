// app/presentation/viewModel/EditarInsertarPersona.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import 'reflect-metadata';
import { IPersonaUseCase } from '../../domain/interfaces/UseCase/IPersonaUseCase';
import { Persona } from '../../domain/entities/Persona';
import { TYPES } from '../../core/types';

@injectable()
export class EditarInsertarPersonaVM {
  @observable private _id: number = 0;
  @observable private _nombre: string = '';
  @observable private _apellidos: string = '';
  @observable private _foto: string = '';
  @observable private _fechaNacimiento: Date = new Date();
  @observable private _direccion: string = '';
  @observable private _telefono: string = '';
  @observable private _idDepartamento: number = 0;
  @observable private _isLoading: boolean = false;
  @observable private _error: string | null = null;
  @observable private _isEditMode: boolean = false;

  private readonly _personaUseCase: IPersonaUseCase;

  constructor(@inject(TYPES.IPersonaUseCase) personaUseCase: IPersonaUseCase) {
    this._personaUseCase = personaUseCase;
    makeObservable(this);
  }

  // Getters
  @computed get id(): number { return this._id; }
  @computed get nombre(): string { return this._nombre; }
  @computed get apellidos(): string { return this._apellidos; }
  @computed get foto(): string { return this._foto; }
  @computed get fechaNacimiento(): Date { return this._fechaNacimiento; }
  @computed get direccion(): string { return this._direccion; }
  @computed get telefono(): string { return this._telefono; }
  @computed get idDepartamento(): number { return this._idDepartamento; }
  @computed get isLoading(): boolean { return this._isLoading; }
  @computed get error(): string | null { return this._error; }
  @computed get isEditMode(): boolean { return this._isEditMode; }

  // Setters
  @action setNombre(value: string): void { this._nombre = value; }
  @action setApellidos(value: string): void { this._apellidos = value; }
  @action setFoto(value: string): void { this._foto = value; }
  @action setFechaNacimiento(value: Date): void { this._fechaNacimiento = value; }
  @action setDireccion(value: string): void { this._direccion = value; }
  @action setTelefono(value: string): void { this._telefono = value; }
  @action setIdDepartamento(value: number): void { this._idDepartamento = value; }

  @action
  public async cargarPersona(id: number): Promise<void> {
    this._isLoading = true;
    this._error = null;
    this._isEditMode = true;
    
    try {
      const persona = await this._personaUseCase.getPersonaById(id);
      
      // ✅ Usar runInAction para cambios después de await
      runInAction(() => {
        this._id = persona.id;
        this._nombre = persona.nombre;
        this._apellidos = persona.apellidos;
        this._foto = persona.foto;
        this._fechaNacimiento = persona.fechaNacimiento;
        this._direccion = persona.direccion;
        this._telefono = persona.telefono;
        this._idDepartamento = persona.idDepartamento;
        this._isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al cargar persona';
        this._isLoading = false;
      });
      console.error('Error al cargar persona:', error);
    }
  }

  @action
  public limpiarFormulario(): void {
    this._id = 0;
    this._nombre = '';
    this._apellidos = '';
    this._foto = '';
    this._fechaNacimiento = new Date();
    this._direccion = '';
    this._telefono = '';
    this._idDepartamento = 0;
    this._error = null;
    this._isEditMode = false;
  }

  @action
  public async guardarPersona(): Promise<number> {
    this._isLoading = true;
    this._error = null;

    try {
      // Validaciones
      if (!this._nombre || !this._apellidos) {
        throw new Error('Nombre y apellidos son obligatorios');
      }

      const persona = new Persona(
        this._id,
        this._nombre,
        this._apellidos,
        this._foto,
        this._fechaNacimiento,
        this._direccion,
        this._telefono,
        this._idDepartamento
      );

      let resultado: number;
      if (this._isEditMode) {
        resultado = await this._personaUseCase.actualizarPersona(this._id, persona);
      } else {
        resultado = await this._personaUseCase.crearPersona(persona);
      }

      runInAction(() => {
        this._isLoading = false;
      });

      return resultado;
    } catch (error) {
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al guardar persona';
        this._isLoading = false;
      });
      console.error('Error al guardar persona:', error);
      throw error;
    }
  }
}
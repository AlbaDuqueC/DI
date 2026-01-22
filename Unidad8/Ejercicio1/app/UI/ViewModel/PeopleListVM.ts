import { Persona } from '../../domain/entities/Persona';
import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IRepositoryPersonas } from "../../domain/interfaces/IPersonaRepo";
import {  makeAutoObservable } from "mobx";




export class PeopleListVM {


    private _personasList: Persona[] = [];
    private _personaSeleccionada: Persona;
   

     constructor(
        @inject(TYPES.IRepositoryPersonas)
        private RepositoryPersonas: IRepositoryPersonas
    ) {


       
        this._personaSeleccionada = new Persona(0, 'Fernando', 'Galiana', '122344556', 'Calle Falsa 123', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1990-01-01'), 1);


        this._personasList = this.RepositoryPersonas.getListadoCompletoPersonas();
        makeAutoObservable(this);
     
    }



    public get personasList(): Persona[] {
        return this._personasList;
    }


    public get personaSeleccionada(): Persona {
        return this._personaSeleccionada;
    }


    public set personaSeleccionada(value: Persona) {
        this._personaSeleccionada = value;
       // alert(`Persona seleccionada en el VM: ${this._personaSeleccionada.nombre} ${this._personaSeleccionada.apellido}`);
     
    }


  }



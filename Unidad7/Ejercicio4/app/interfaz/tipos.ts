export interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

export type Estado = Tarea[];

export type Accion =
  | { type: 'AGREGAR'; payload: { texto: string } }
  | { type: 'TOGGLE'; payload: { id: number } }
  | { type: 'ELIMINAR'; payload: { id: number } };

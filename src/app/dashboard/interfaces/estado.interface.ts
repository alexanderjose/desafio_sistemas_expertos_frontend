export interface Estado {
    id: string;
    descripcion: string;
 }
 
 
 export interface Ticket {
     id: number,
     titulo: string;
     descripcion: string;
     estado: number;
     estado_nombre: string;
     fecha_creacion: string;
 }
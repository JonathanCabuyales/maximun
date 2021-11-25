export interface ProsernuevoI {
    //variables a utilizar
    id_proser: number,
    codigo_proser: string,
    categoria_proser: string,
    nombre_proser: string,
    descripcion_proser: string,
    precio_proser: number,
    cantidad_proser: number,
    cantidadfinal_proser: number,
    created_at: Date,
    token?: string
}
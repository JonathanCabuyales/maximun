export interface DepreciacionI{
    id_dep?: string
    id_usuario: string,
    descripcion: string,
    fecha_compra: string,
    valor_inicial:string,
    valor_anual:string,
    id_cuentas:string,
    token?: string
}
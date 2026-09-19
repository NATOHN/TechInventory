// Importamos el cliente único de Supabase utilizado por TechInventory.
import { supabase } from "../lib/supabase";

// Representa exactamente un departamento almacenado en public.departamentos.
// sucursal_id mantiene la relación con la tabla public.sucursales.
export type Departamento = {
    id: number;
    nombre: string;
    sucursal_id: number;
    created_at: string;
};

// Obtiene todos los departamentos desde Supabase.
// Redux utilizará posteriormente este servicio para mantener el catálogo en memoria.
export const obtenerDepartamentos = async (): Promise<Departamento[]> => {
    const { data, error } = await supabase
        .from("departamentos")
        .select("id, nombre, sucursal_id, created_at")
        .order("nombre", { ascending: true });

    // Si Supabase devuelve un error, lo propagamos para manejarlo posteriormente desde Redux.
    if (error) throw error;

    // Si Supabase no devuelve registros, mantenemos un arreglo vacío.
    return data ?? [];
};
// Importamos el cliente único de Supabase configurado para TechInventory.
import { supabase } from "../lib/supabase";

// Representa exactamente una sucursal almacenada en la tabla public.sucursales.
export type Sucursal = {
    id: number;
    nombre: string;
    created_at: string;
};

// Obtiene todas las sucursales desde Supabase.
// Redux utilizará posteriormente esta función para cargar el catálogo en la interfaz.
export const obtenerSucursales = async (): Promise<Sucursal[]> => {
    const { data, error } = await supabase
        .from("sucursales")
        .select("id, nombre, created_at")
        .order("nombre", { ascending: true });

    // Si Supabase devuelve un error, lo propagamos para que Redux pueda manejarlo.
    if (error) throw error;

    // Si por alguna razón data viene vacío o null, devolvemos un arreglo vacío.
    return data ?? [];
};
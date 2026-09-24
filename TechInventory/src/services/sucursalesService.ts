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

// Crea una nueva sucursal en Supabase y devuelve el registro generado.
// created_at no se envía porque Supabase lo genera automáticamente en la tabla.
export const crearSucursal = async (nombre: string): Promise<Sucursal> => {
    const nombreLimpio = nombre.trim();

    // Evitamos enviar nombres vacíos directamente a la base de datos.
    if (!nombreLimpio) throw new Error("El nombre de la sucursal es obligatorio.");

    const { data, error } = await supabase
        .from("sucursales")
        .insert({ nombre: nombreLimpio })
        .select("id, nombre, created_at")
        .single();

    // Mostramos el error completo que devuelve Supabase para poder diagnosticarlo.
    if (error) {
        console.log("Error de Supabase al crear sucursal:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        });

        // Lo convertimos en Error para que Redux conserve el mensaje real.
        throw new Error(error.message);
    }


    return data;
};
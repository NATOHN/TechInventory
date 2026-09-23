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

// Registra un nuevo departamento y lo relaciona con una sucursal existente.
export const crearDepartamento = async (
    nombre: string,
    sucursalId: number
): Promise<Departamento> => {
    const nombreLimpio = nombre.trim();

    // Validamos los datos antes de enviarlos a Supabase.
    if (!nombreLimpio) throw new Error("El nombre del departamento es obligatorio.");
    if (!sucursalId) throw new Error("Debe seleccionar una sucursal.");

    const { data, error } = await supabase
        .from("departamentos")
        .insert({
            nombre: nombreLimpio,
            sucursal_id: sucursalId,
        })
        .select("id, nombre, sucursal_id, created_at")
        .single();

    // Conservamos el mensaje real de Supabase para poder diagnosticar cualquier problema.
    if (error) {
        console.log("Error de Supabase al crear departamento:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        });

        throw new Error(error.message);
    }

    return data;
};
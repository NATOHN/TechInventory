// Importamos el cliente único de Supabase utilizado por TechInventory.
import { supabase } from "../lib/supabase";

// Representa un empleado almacenado dentro de public.empleados.
export type Empleado = {
    id: number;
    nombre: string;
    departamento_id: number;
    activo: boolean;
    created_at: string;
};

// Obtiene los empleados activos desde Supabase.
// La relación con sucursal se obtiene indirectamente mediante departamento_id.
export const obtenerEmpleados = async (): Promise<Empleado[]> => {
    const { data, error } = await supabase
        .from("empleados")
        .select("id, nombre, departamento_id, activo, created_at")
        .eq("activo", true)
        .order("nombre", { ascending: true });

    // Propagamos el error para que Redux pueda manejarlo.
    if (error) throw error;

    // Siempre devolvemos un arreglo para simplificar su uso en Redux.
    return data ?? [];
};
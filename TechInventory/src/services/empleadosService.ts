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


// Registra un nuevo empleado activo y lo relaciona con un departamento existente.
export const crearEmpleado = async (
    nombre: string,
    departamentoId: number
): Promise<Empleado> => {
    const nombreLimpio = nombre.trim();

    // Validamos la información antes de enviarla a Supabase.
    if (!nombreLimpio) throw new Error("El nombre del empleado es obligatorio.");
    if (!departamentoId) throw new Error("Debe seleccionar un departamento.");

    const { data, error } = await supabase
        .from("empleados")
        .insert({
            nombre: nombreLimpio,
            departamento_id: departamentoId,
            activo: true,
        })
        .select("id, nombre, departamento_id, activo, created_at")
        .single();

    // Conservamos el error real para identificar problemas de RLS o base de datos.
    if (error) {
        console.log("Error de Supabase al crear empleado:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        });

        throw new Error(error.message);
    }

    return data;
};
// Importamos el cliente principal de Supabase.
import { supabase } from "../lib/supabase";

// Reutilizamos exactamente los tipos que actualmente maneja Redux.
// Así evitamos tener dos estructuras diferentes para el mismo historial.
import type {
    EquipmentLocationHistory,
    EquipmentStatusHistory,
} from "../redux/equipmentSlice";


// =========================================================
// HISTORIAL DE UBICACIONES
// =========================================================

// Sincroniza los movimientos de ubicación de un equipo.
// Se recibe el ID técnico de PostgreSQL y el historial actual almacenado en Redux.
export const sincronizarHistorialUbicaciones = async (
    equipoId: number,
    historial: EquipmentLocationHistory[]
) => {
    // Si el equipo todavía no tiene movimientos no necesitamos consultar Supabase.
    if (historial.length === 0) return;

    // Convertimos la estructura utilizada por React Native
    // al formato snake_case utilizado por PostgreSQL.
    const registros = historial.map((movimiento) => ({
        equipo_id: equipoId,
        sucursal_anterior: movimiento.sucursalAnterior,
        departamento_anterior: movimiento.departamentoAnterior,
        empleado_anterior: movimiento.empleadoAnterior ?? null,
        sucursal_nueva: movimiento.sucursalNueva,
        departamento_nuevo: movimiento.departamentoNuevo,
        empleado_nuevo: movimiento.empleadoNuevo ?? null,
        realizado_por_id: movimiento.realizadoPorId ?? null,
        realizado_por_nombre: movimiento.realizadoPorNombre ?? null,
        fecha: movimiento.fecha,
    }));

    // Enviamos el historial completo, pero ignoreDuplicates impide
    // volver a insertar eventos que ya existen en Supabase.
    const { error } = await supabase
        .from("historial_ubicaciones")
        .upsert(registros, {
            onConflict: "equipo_id,fecha",
            ignoreDuplicates: true,
        });

    if (error) throw error;
};


// Obtiene desde Supabase todo el historial de ubicación de un equipo.
// Lo dejaremos preparado para cuando Supabase reemplace AsyncStorage como fuente principal.
export const obtenerHistorialUbicaciones = async (
    equipoId: number
): Promise<EquipmentLocationHistory[]> => {
    const { data, error } = await supabase
        .from("historial_ubicaciones")
        .select(`
            sucursal_anterior,
            departamento_anterior,
            empleado_anterior,
            sucursal_nueva,
            departamento_nuevo,
            empleado_nuevo,
            realizado_por_id,
            realizado_por_nombre,
            fecha
        `)
        .eq("equipo_id", equipoId)
        .order("fecha", { ascending: true });

    if (error) throw error;

    // Regresamos nuevamente al formato que Equipment utiliza actualmente.
    return (data ?? []).map((movimiento) => ({
        sucursalAnterior: movimiento.sucursal_anterior,
        departamentoAnterior: movimiento.departamento_anterior,
        empleadoAnterior: movimiento.empleado_anterior ?? undefined,
        sucursalNueva: movimiento.sucursal_nueva,
        departamentoNuevo: movimiento.departamento_nuevo,
        empleadoNuevo: movimiento.empleado_nuevo ?? undefined,
        realizadoPorId: movimiento.realizado_por_id ?? undefined,
        realizadoPorNombre: movimiento.realizado_por_nombre ?? undefined,
        fecha: movimiento.fecha,
    }));
};


// =========================================================
// HISTORIAL DE ESTADOS
// =========================================================

// Sincroniza bajas, reactivaciones y cambios provocados por Mantenimiento.
export const sincronizarHistorialEstados = async (
    equipoId: number,
    historial: EquipmentStatusHistory[]
) => {
    // Evitamos realizar una consulta cuando todavía no existen eventos.
    if (historial.length === 0) return;

    const registros = historial.map((evento) => ({
        equipo_id: equipoId,
        estado_anterior: evento.estadoAnterior,
        estado_nuevo: evento.estadoNuevo,
        origen: evento.origen,
        motivo: evento.motivo ?? null,
        realizado_por_id: evento.realizadoPorId ?? null,
        realizado_por_nombre: evento.realizadoPorNombre ?? null,
        fecha: evento.fecha,
    }));

    // Volvemos a enviar el arreglo completo cuando el equipo cambia.
    // La restricción equipo_id + fecha evita duplicar eventos anteriores.
    const { error } = await supabase
        .from("historial_estados")
        .upsert(registros, {
            onConflict: "equipo_id,fecha",
            ignoreDuplicates: true,
        });

    if (error) throw error;
};


// Obtiene los cambios de estado almacenados en Supabase.
// Esta función se utilizará cuando eliminemos la lectura inicial desde AsyncStorage.
export const obtenerHistorialEstados = async (
    equipoId: number
): Promise<EquipmentStatusHistory[]> => {
    const { data, error } = await supabase
        .from("historial_estados")
        .select(`
            estado_anterior,
            estado_nuevo,
            origen,
            motivo,
            realizado_por_id,
            realizado_por_nombre,
            fecha
        `)
        .eq("equipo_id", equipoId)
        .order("fecha", { ascending: true });

    if (error) throw error;

    // Reconstruimos exactamente el formato que ya consume EquipmentHistoryScreen.
    return (data ?? []).map((evento) => ({
        estadoAnterior: evento.estado_anterior,
        estadoNuevo: evento.estado_nuevo,
        origen: evento.origen,
        motivo: evento.motivo ?? undefined,
        realizadoPorId: evento.realizado_por_id ?? undefined,
        realizadoPorNombre: evento.realizado_por_nombre ?? undefined,
        fecha: evento.fecha,
    }));
};
// Importamos el cliente principal de Supabase.
import { supabase } from "../lib/supabase";

// Reutilizamos exactamente la estructura que ya utiliza Redux.
import type { Maintenance } from "../redux/maintenanceSlice";
// Genera una URL temporal para visualizar firmas almacenadas
// dentro del bucket privado de Supabase Storage.
import { obtenerUrlFirmaMantenimiento } from "./maintenanceSignaturesService";


// Sincroniza el estado actual de un mantenimiento con PostgreSQL.
// También reemplaza su checklist y sus repuestos con la versión actual de Redux.
export const sincronizarMantenimientoConSupabase = async (
    mantenimiento: Maintenance
) => {
    // Localizamos primero el equipo mediante su código estable.
    const { data: equipo, error: equipoError } = await supabase
        .from("equipos")
        .select("id")
        .eq("codigo", mantenimiento.codigoEquipo)
        .single();

    if (equipoError) throw equipoError;

    // El código visible MT-0001 será la clave estable utilizada para el upsert.
    const codigoMantenimiento =
        mantenimiento.codigoMantenimiento ?? mantenimiento.id;

    // Insertamos o actualizamos el registro principal.
    // firma_path conservará la ubicación permanente de la firma dentro de Supabase Storage.
    const { data: mantenimientoGuardado, error: mantenimientoError } =
        await supabase
            .from("mantenimientos")
            .upsert(
                {
                    codigo_mantenimiento: codigoMantenimiento,
                    equipo_id: equipo.id,
                    tecnico: mantenimiento.tecnico,
                    // Relaciones reales del técnico seleccionado.
                    tecnico_empleado_id: mantenimiento.tecnicoEmpleadoId ?? null,
                    tecnico_usuario_id: mantenimiento.tecnicoUsuarioId ?? null,
                    tipo: mantenimiento.tipo,
                    prioridad: mantenimiento.prioridad ?? "media",
                    descripcion: mantenimiento.descripcion,
                    estado_final: mantenimiento.estadoFinal ?? null,
                    motivo_baja: mantenimiento.motivoBaja ?? null,
                    status: mantenimiento.status,
                    fecha_inicio: mantenimiento.fechaInicio,
                    fecha_finalizacion: mantenimiento.fechaFinalizacion ?? null,
                    firmado_por_nombre: mantenimiento.firmadoPorNombre ?? null,
                    fecha_firma: mantenimiento.fechaFirma ?? null,

                    // Guardamos únicamente la ruta permanente del archivo.
                    // La imagen física permanece dentro del bucket privado.
                    firma_path: mantenimiento.firmaPath ?? null,

                    // Estos campos representan al usuario que creó el registro.
                    registrado_por_id: mantenimiento.registradoPorId ?? null,
                    registrado_por_nombre: mantenimiento.registradoPorNombre ?? null,
                    // El correo identifica de forma visible la cuenta que realizó el registro.
                    registrado_por_correo: mantenimiento.registradoPorCorreo ?? null,
                },
                {
                    onConflict: "codigo_mantenimiento",
                }
            )
            .select("id")
            .single();

    if (mantenimientoError) throw mantenimientoError;

    const mantenimientoId = mantenimientoGuardado.id;

    // El checklist representa el estado actual del formulario.
    // Eliminamos la versión anterior y guardamos nuevamente la versión de Redux.
    const { error: eliminarChecklistError } = await supabase
        .from("mantenimiento_checklist")
        .delete()
        .eq("mantenimiento_id", mantenimientoId);

    if (eliminarChecklistError) throw eliminarChecklistError;

    if (mantenimiento.checklist.length > 0) {
        const checklist = mantenimiento.checklist.map((item, index) => ({
            mantenimiento_id: mantenimientoId,
            orden: index,
            label: item.label,
            checked: item.checked,
            registrado_por_id: mantenimiento.registradoPorId ?? null,
            registrado_por_nombre: mantenimiento.registradoPorNombre ?? null,
        }));

        const { error } = await supabase
            .from("mantenimiento_checklist")
            .insert(checklist);

        if (error) throw error;
    }

    // Aplicamos la misma estrategia para los repuestos porque el usuario
    // puede agregar o eliminar elementos mientras el mantenimiento está En proceso.
    const { error: eliminarRepuestosError } = await supabase
        .from("mantenimiento_repuestos")
        .delete()
        .eq("mantenimiento_id", mantenimientoId);

    if (eliminarRepuestosError) throw eliminarRepuestosError;

    if (mantenimiento.repuestos.length > 0) {
        const repuestos = mantenimiento.repuestos.map((repuesto, index) => ({
            mantenimiento_id: mantenimientoId,
            orden: index,
            nombre: repuesto.nombre,
            cantidad: repuesto.cantidad,
            registrado_por_id: mantenimiento.registradoPorId ?? null,
            registrado_por_nombre: mantenimiento.registradoPorNombre ?? null,
        }));

        const { error } = await supabase
            .from("mantenimiento_repuestos")
            .insert(repuestos);

        if (error) throw error;
    }
};

// Representa la fila principal recuperada desde public.mantenimientos.
type MantenimientoSupabaseRow = {
    id: number;
    codigo_mantenimiento: string;
    equipo_id: number;
    tecnico: string;
    tecnico_empleado_id: number | null;
    tecnico_usuario_id: string | null;
    tipo: Maintenance["tipo"];
    prioridad: Maintenance["prioridad"] | null;
    descripcion: string;
    estado_final: string | null;
    motivo_baja: string | null;
    status: Maintenance["status"];
    fecha_inicio: string;
    fecha_finalizacion: string | null;
    firmado_por_nombre: string | null;
    fecha_firma: string | null;
    // Ruta permanente de la firma dentro de Supabase Storage.
firma_path: string | null;
    registrado_por_id: string | null;
    registrado_por_nombre: string | null;
    registrado_por_correo: string | null;
};

// Representa un elemento del checklist almacenado en PostgreSQL.
type ChecklistSupabaseRow = {
    mantenimiento_id: number;
    orden: number;
    label: string;
    checked: boolean;
};

// Representa un repuesto relacionado con un mantenimiento.
type RepuestoSupabaseRow = {
    mantenimiento_id: number;
    orden: number;
    nombre: string;
    cantidad: number;
};

// Recupera todos los mantenimientos reales desde Supabase
// y reconstruye la misma estructura utilizada actualmente por Redux.
export const obtenerMantenimientosDesdeSupabase = async (): Promise<Maintenance[]> => {
    // Consultamos el registro principal, sus relaciones y los códigos
    // de los equipos al mismo tiempo para reducir tiempos de espera.
    const [
        mantenimientosResponse,
        checklistResponse,
        repuestosResponse,
        equiposResponse,
    ] = await Promise.all([
        supabase
            .from("mantenimientos")
            .select(`
                id,
                codigo_mantenimiento,
                equipo_id,
                tecnico,
                tecnico_empleado_id,
                tecnico_usuario_id,
                tipo,
                prioridad,
                descripcion,
                estado_final,
                motivo_baja,
                status,
                fecha_inicio,
                fecha_finalizacion,
                firmado_por_nombre,
                fecha_firma,
                firma_path,
                registrado_por_id,
                registrado_por_nombre,
                registrado_por_correo
            `)
            .order("fecha_inicio", { ascending: false }),

        supabase
            .from("mantenimiento_checklist")
            .select("mantenimiento_id,orden,label,checked"),

        supabase
            .from("mantenimiento_repuestos")
            .select("mantenimiento_id,orden,nombre,cantidad"),

        supabase
            .from("equipos")
            .select("id,codigo"),
    ]);

    // Si alguna consulta falla, dejamos que Store pueda utilizar
    // AsyncStorage únicamente como respaldo temporal.
    if (mantenimientosResponse.error) throw mantenimientosResponse.error;
    if (checklistResponse.error) throw checklistResponse.error;
    if (repuestosResponse.error) throw repuestosResponse.error;
    if (equiposResponse.error) throw equiposResponse.error;

    const mantenimientos =
        (mantenimientosResponse.data ?? []) as MantenimientoSupabaseRow[];

    const checklist =
        (checklistResponse.data ?? []) as ChecklistSupabaseRow[];

    const repuestos =
        (repuestosResponse.data ?? []) as RepuestoSupabaseRow[];

    // Relacionamos el ID interno de PostgreSQL con el código visible EQ-XXXX.
    const codigoEquipoPorId = new Map(
        (equiposResponse.data ?? []).map((equipo) => [
            equipo.id,
            equipo.codigo,
        ])
    );

    // Reconstruimos el checklist correspondiente a cada mantenimiento.
    const checklistPorMantenimiento = new Map<number, Maintenance["checklist"]>();

    checklist
        .sort((a, b) => a.orden - b.orden)
        .forEach((item) => {
            const actual = checklistPorMantenimiento.get(item.mantenimiento_id) ?? [];

            actual.push({
                label: item.label,
                checked: item.checked,
            });

            checklistPorMantenimiento.set(
                item.mantenimiento_id,
                actual
            );
        });

    // Reconstruimos de la misma forma los repuestos asociados.
    const repuestosPorMantenimiento = new Map<number, Maintenance["repuestos"]>();

    repuestos
        .sort((a, b) => a.orden - b.orden)
        .forEach((item) => {
            const actual = repuestosPorMantenimiento.get(item.mantenimiento_id) ?? [];

            actual.push({
                nombre: item.nombre,
                cantidad: item.cantidad,
            });

            repuestosPorMantenimiento.set(
                item.mantenimiento_id,
                actual
            );
        });

    // Convertimos cada fila PostgreSQL a la estructura Maintenance
    // que ya utilizan las pantallas actuales.
    return  Promise.all(
    mantenimientos.map(async (mantenimiento) => {
                // Si el mantenimiento tiene una firma almacenada,
        // generamos una URL privada temporal para visualizarla.
        const firmaUrl = mantenimiento.firma_path
            ? await obtenerUrlFirmaMantenimiento(mantenimiento.firma_path)
            : undefined;

        return {

        // Utilizamos el código estable como ID dentro de Redux.
        id: mantenimiento.codigo_mantenimiento,
        codigoMantenimiento: mantenimiento.codigo_mantenimiento,

        codigoEquipo:
            codigoEquipoPorId.get(mantenimiento.equipo_id) ??
            "Equipo no identificado",

        registradoPorId:
            mantenimiento.registrado_por_id ?? undefined,

        registradoPorNombre:
            mantenimiento.registrado_por_nombre ?? undefined,

        registradoPorCorreo:
            mantenimiento.registrado_por_correo ?? undefined,

        tecnicoEmpleadoId:
            mantenimiento.tecnico_empleado_id ?? undefined,

        tecnicoUsuarioId:
            mantenimiento.tecnico_usuario_id ?? undefined,

        tecnico: mantenimiento.tecnico,
        tipo: mantenimiento.tipo,
        prioridad: mantenimiento.prioridad ?? undefined,

        checklist:
            checklistPorMantenimiento.get(mantenimiento.id) ?? [],

        repuestos:
            repuestosPorMantenimiento.get(mantenimiento.id) ?? [],

        descripcion: mantenimiento.descripcion,

        estadoFinal:
            mantenimiento.estado_final ?? undefined,

        motivoBaja:
            mantenimiento.motivo_baja ?? undefined,

        firmadoPorNombre:
            mantenimiento.firmado_por_nombre ?? undefined,

        fechaFirma:
            mantenimiento.fecha_firma ?? undefined,

                // Conservamos la ruta permanente por si necesitamos
        // volver a generar otra URL firmada posteriormente.
        firmaPath:
            mantenimiento.firma_path ?? undefined,

        // La interfaz actual utiliza firmaBase64 para mostrar la firma.
        // Temporalmente reutilizamos ese mismo campo con la URL firmada
        // para no romper las pantallas existentes.
        firmaBase64: firmaUrl,

        status: mantenimiento.status,
        fechaInicio: mantenimiento.fecha_inicio,

        fechaFinalizacion:
            mantenimiento.fecha_finalizacion ?? undefined,
   };
    })
);
};
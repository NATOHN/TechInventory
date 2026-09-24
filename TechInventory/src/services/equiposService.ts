// Importamos el cliente único de Supabase utilizado por TechInventory.
import { supabase } from "../lib/supabase";

// Gestiona la subida de fotografías reales a Supabase Storage.
import { subirFotoEquipo } from "./equipmentImagesService";

// Importamos únicamente los tipos necesarios.
// Redux conserva su estructura actual y este servicio traduce sus datos a PostgreSQL.
import type { Equipment } from "../redux/equipmentSlice";
import type { Sucursal } from "./sucursalesService";
import type { Departamento } from "./departamentosService";
import type { Empleado } from "./empleadosService";

// Importamos la sincronización de los historiales que ya forman parte del Equipment.
import {
    sincronizarHistorialEstados,
    sincronizarHistorialUbicaciones,
} from "./historialEquiposService";


// Catálogos necesarios para convertir los nombres utilizados actualmente
// por Redux en los IDs relacionales almacenados en Supabase.
type CatalogosEquipo = {
    sucursales: Sucursal[];
    departamentos: Departamento[];
    empleados: Empleado[];
};


// Sincroniza el estado actual de un equipo con public.equipos.
// Después sincroniza también sus historiales sin alterar Redux.
export const sincronizarEquipoConSupabase = async (
    equipo: Equipment,
    catalogos: CatalogosEquipo
) => {
    // Localizamos la sucursal seleccionada utilizando el nombre que actualmente guarda Redux.
    const sucursal = catalogos.sucursales.find(
        (item) => item.nombre === equipo.sucursal
    );

    if (!sucursal) {
        throw new Error(`No se encontró la sucursal "${equipo.sucursal}" en Supabase.`);
    }

    // Comprobamos que el departamento pertenezca realmente a la sucursal seleccionada.
    const departamento = catalogos.departamentos.find(
        (item) =>
            item.nombre === equipo.departamento &&
            item.sucursal_id === sucursal.id
    );

    if (!departamento) {
        throw new Error(
            `No se encontró el departamento "${equipo.departamento}" para la sucursal "${equipo.sucursal}".`
        );
    }

    // Redux utiliza "Sin asignar", mientras PostgreSQL representa esa ausencia mediante null.
    const nombreEmpleado = equipo.empleadoAsignado?.trim();
    const sinEmpleado =
        !nombreEmpleado ||
        nombreEmpleado === "Sin asignar";

    const empleado = sinEmpleado
        ? null
        : catalogos.empleados.find(
            (item) =>
                item.nombre === nombreEmpleado &&
                item.departamento_id === departamento.id
        );

    // Evitamos relacionar el equipo con un empleado incorrecto o inexistente.
    if (!sinEmpleado && !empleado) {
        throw new Error(
            `No se encontró el empleado "${nombreEmpleado}" dentro del departamento seleccionado.`
        );
    }

    // Si la fotografía proviene de cámara o galería la subimos primero
    // a Supabase Storage. Si ya es una URL remota simplemente se conserva.
    const fotoPath = await subirFotoEquipo(
        equipo.codigo,
        equipo.foto
    );

    // Insertamos o actualizamos el equipo utilizando su código estable.
    // Solicitamos de vuelta el ID técnico porque los historiales lo utilizan como relación.
    const { data: equipoGuardado, error } = await supabase
        .from("equipos")
        .upsert(
            {
                codigo: equipo.codigo,
                marca: equipo.marca,
                modelo: equipo.modelo,
                serie: equipo.serie,
                sucursal_id: sucursal.id,
                departamento_id: departamento.id,
                empleado_id: empleado?.id ?? null,
                status: equipo.status,
                estado_antes_de_baja: equipo.estadoAntesDeBaja ?? null,

                // Conservamos en PostgreSQL la URL pública de la fotografía
                // almacenada físicamente dentro de Supabase Storage.
                foto_path: fotoPath,
            },
            {
                onConflict: "codigo",
            }
        )
        .select("id")
        .single();

    if (error) throw error;

    // Una vez confirmada la existencia del equipo en PostgreSQL,
    // sincronizamos los historiales asociados al mismo ID técnico.
    await Promise.all([
        sincronizarHistorialUbicaciones(
            equipoGuardado.id,
            equipo.historialUbicaciones ?? []
        ),

        sincronizarHistorialEstados(
            equipoGuardado.id,
            equipo.historialEstados ?? []
        ),
    ]);
};

// Estructura mínima utilizada al recuperar equipos desde PostgreSQL.
// Los IDs relacionales serán transformados nuevamente a los nombres
// que actualmente consume Redux.
type EquipoSupabaseRow = {
    codigo: string;
    marca: string;
    modelo: string;
    serie: string;
    sucursal_id: number;
    departamento_id: number;
    empleado_id: number | null;
    status: Equipment["status"];
    estado_antes_de_baja: "activo" | "taller" | null;
    foto_path: string | null;
};

// Devuelve una imagen compatible con la estructura actual de Equipment.
// Cuando exista una URL real de Supabase Storage podremos utilizarla.
// Mientras tanto conservamos una imagen local de respaldo según la marca.
const obtenerFotoParaRedux = (
    marca: string,
    fotoPath: string | null
): Equipment["foto"] => {
    // Si posteriormente foto_path contiene una URL real de Storage,
    // cualquier dispositivo podrá visualizar la misma fotografía.
    if (fotoPath?.startsWith("http")) {
        return { uri: fotoPath };
    }

    // Actualmente el catálogo de marcas utiliza Dell y HP.
    if (marca.trim().toLowerCase() === "hp") {
        return require("../img/hp-prodesk-400-g9.png");
    }

    return require("../img/dell.png");
};

// Recupera el inventario real completo desde Supabase y lo transforma
// al mismo formato que ya utilizan EquipmentList, Detail y Mantenimiento.
export const obtenerEquiposDesdeSupabase = async (): Promise<Equipment[]> => {
    // Consultamos equipos y catálogos al mismo tiempo.
    // Esto evita depender del orden en que Redux haya cargado los catálogos.
    const [
        equiposResponse,
        sucursalesResponse,
        departamentosResponse,
        empleadosResponse,
    ] = await Promise.all([
        supabase
            .from("equipos")
            .select(`
                codigo,
                marca,
                modelo,
                serie,
                sucursal_id,
                departamento_id,
                empleado_id,
                status,
                estado_antes_de_baja,
                foto_path
            `)
            .order("codigo", { ascending: true }),

        supabase
            .from("sucursales")
            .select("id,nombre"),

        supabase
            .from("departamentos")
            .select("id,nombre"),

        supabase
            .from("empleados")
            .select("id,nombre"),
    ]);

    // Cualquier error debe llegar al Store para poder utilizar
    // el respaldo local solamente cuando Supabase no esté disponible.
    if (equiposResponse.error) throw equiposResponse.error;
    if (sucursalesResponse.error) throw sucursalesResponse.error;
    if (departamentosResponse.error) throw departamentosResponse.error;
    if (empleadosResponse.error) throw empleadosResponse.error;

    const equipos = (equiposResponse.data ?? []) as EquipoSupabaseRow[];

    // Creamos mapas por ID para convertir rápidamente
    // las relaciones PostgreSQL al formato actual de Redux.
    const sucursalesPorId = new Map(
        (sucursalesResponse.data ?? []).map((sucursal) => [
            sucursal.id,
            sucursal.nombre,
        ])
    );

    const departamentosPorId = new Map(
        (departamentosResponse.data ?? []).map((departamento) => [
            departamento.id,
            departamento.nombre,
        ])
    );

    const empleadosPorId = new Map(
        (empleadosResponse.data ?? []).map((empleado) => [
            empleado.id,
            empleado.nombre,
        ])
    );

    // Transformamos cada fila PostgreSQL a Equipment.
    return equipos.map((equipo) => ({
        codigo: equipo.codigo,
        marca: equipo.marca,
        modelo: equipo.modelo,
        serie: equipo.serie,

        sucursal:
            sucursalesPorId.get(equipo.sucursal_id) ??
            "Sucursal no identificada",

        departamento:
            departamentosPorId.get(equipo.departamento_id) ??
            "Departamento no identificado",

        empleadoAsignado:
            equipo.empleado_id === null
                ? "Sin asignar"
                : empleadosPorId.get(equipo.empleado_id) ??
                "Sin asignar",

        status: equipo.status,

        // Por ahora la fotografía tiene respaldo local.
        // Más adelante migraremos las fotografías a Supabase Storage.
        foto: obtenerFotoParaRedux(
            equipo.marca,
            equipo.foto_path
        ),

        estadoAntesDeBaja:
            equipo.estado_antes_de_baja ?? undefined,

        // Los historiales serán conectados en un bloque posterior.
        // No los inventamos ni los eliminamos de PostgreSQL.
        historialUbicaciones: [],
        historialEstados: [],
    }));
};
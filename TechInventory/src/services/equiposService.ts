// Importamos el cliente único de Supabase utilizado por TechInventory.
import { supabase } from "../lib/supabase";

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
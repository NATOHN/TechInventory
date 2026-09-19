// Importamos el cliente único de Supabase utilizado por TechInventory.
import { supabase } from "../lib/supabase";

// Importamos únicamente los tipos necesarios.
// Redux conserva su estructura actual y este servicio se encarga de traducirla a PostgreSQL.
import type { Equipment } from "../redux/equipmentSlice";
import type { Sucursal } from "./sucursalesService";
import type { Departamento } from "./departamentosService";
import type { Empleado } from "./empleadosService";

// Catálogos necesarios para convertir los nombres utilizados actualmente
// por Redux en los IDs relacionales almacenados en Supabase.
type CatalogosEquipo = {
    sucursales: Sucursal[];
    departamentos: Departamento[];
    empleados: Empleado[];
};

// Sincroniza el estado actual de un equipo con public.equipos.
// Utilizamos codigo como identificador estable para decidir si insertar o actualizar.
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

    // Localizamos el departamento y además comprobamos que pertenezca
    // realmente a la sucursal seleccionada.
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

    // "Sin asignar" continúa siendo la representación utilizada actualmente por Redux.
    // En PostgreSQL una ausencia de empleado se almacena correctamente como null.
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

    // Si Redux indica un empleado pero no existe en Supabase,
    // detenemos la sincronización para no guardar una relación incorrecta.
    if (!sinEmpleado && !empleado) {
        throw new Error(
            `No se encontró el empleado "${nombreEmpleado}" dentro del departamento seleccionado.`
        );
    }

    // Upsert nos permite utilizar el mismo método tanto para registrar
    // como para actualizar un equipo existente mediante su código estable.
    const { error } = await supabase
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
        );

    // Dejamos que Store controle y muestre cualquier problema de sincronización.
    if (error) throw error;
};
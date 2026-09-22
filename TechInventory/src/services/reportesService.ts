// 1. Cliente oficial utilizado por TechInventory.
import { supabase } from '../lib/supabase';

// 2. Rangos disponibles actualmente en la interfaz de Reportes.
export type ReportPeriod =
  | 'mes_actual'
  | 'ultimos_30'
  | 'anio_actual'
  | 'todo';

// 3. Equipo preparado específicamente para la pantalla y el archivo Excel.
export type ReportEquipment = {
  id: number;
  codigo: string;
  marca: string;
  modelo: string;
  serie: string;
  status: 'activo' | 'taller' | 'baja';
  sucursal: string;
  departamento: string;
  empleado: string;
  createdAt: string;
};

// 4. Mantenimiento preparado para Reportes.
export type ReportMaintenance = {
  id: number;
  codigoMantenimiento: string;
  codigoEquipo: string;
  tipo: 'preventivo' | 'correctivo';
  status: 'en_proceso' | 'finalizado';
  tecnico: string;
  fechaInicio: string;
  fechaFinalizacion: string | null;
};

// 5. Resultado completo que consumirá ReportsScreen.
export type ReportData = {
  equipos: ReportEquipment[];
  mantenimientos: ReportMaintenance[];
};

// 6. Devuelve las fechas reales correspondientes al filtro seleccionado.
export const obtenerRangoReporte = (periodo: ReportPeriod) => {
  const ahora = new Date();

  if (periodo === 'todo') {
    return {
      inicio: null,
      fin: null,
      etiqueta: 'Todo el historial',
    };
  }

  let inicio = new Date();

  if (periodo === 'mes_actual') {
    inicio = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
  }

  if (periodo === 'ultimos_30') {
    inicio = new Date(ahora);
    inicio.setDate(inicio.getDate() - 30);
    inicio.setHours(0, 0, 0, 0);
  }

  if (periodo === 'anio_actual') {
    inicio = new Date(
      ahora.getFullYear(),
      0,
      1,
      0,
      0,
      0,
      0
    );
  }

  const fin = new Date(ahora);
  fin.setHours(23, 59, 59, 999);

  return {
    inicio: inicio.toISOString(),
    fin: fin.toISOString(),

    etiqueta:
      periodo === 'mes_actual'
        ? 'Este mes'
        : periodo === 'ultimos_30'
          ? 'Últimos 30 días'
          : 'Este año',
  };
};

// 7. Recupera desde Supabase solamente los registros correspondientes
// al período seleccionado.
export const obtenerReporteDesdeSupabase = async (
  periodo: ReportPeriod
): Promise<ReportData> => {
  const rango = obtenerRangoReporte(periodo);

  // Construimos primero las consultas base.
  let equiposQuery = supabase
    .from('equipos')
    .select(`
      id,
      codigo,
      marca,
      modelo,
      serie,
      status,
      sucursal_id,
      departamento_id,
      empleado_id,
      created_at
    `)
    .order('created_at', { ascending: false });

  let mantenimientosQuery = supabase
    .from('mantenimientos')
    .select(`
      id,
      codigo_mantenimiento,
      equipo_id,
      tipo,
      status,
      tecnico,
      fecha_inicio,
      fecha_finalizacion
    `)
    .order('fecha_inicio', { ascending: false });

  // 8. Cuando el usuario selecciona un período,
  // Supabase realiza el filtrado directamente en PostgreSQL.
  if (rango.inicio && rango.fin) {
    equiposQuery = equiposQuery
      .gte('created_at', rango.inicio)
      .lte('created_at', rango.fin);

    mantenimientosQuery = mantenimientosQuery
      .gte('fecha_inicio', rango.inicio)
      .lte('fecha_inicio', rango.fin);
  }

  // 9. Catálogos necesarios para transformar IDs en nombres legibles.
  const [
    equiposResponse,
    mantenimientosResponse,
    sucursalesResponse,
    departamentosResponse,
    empleadosResponse,
  ] = await Promise.all([
    equiposQuery,
    mantenimientosQuery,

    supabase
      .from('sucursales')
      .select('id,nombre'),

    supabase
      .from('departamentos')
      .select('id,nombre'),

    supabase
      .from('empleados')
      .select('id,nombre'),
  ]);

  if (equiposResponse.error) throw equiposResponse.error;
  if (mantenimientosResponse.error) throw mantenimientosResponse.error;
  if (sucursalesResponse.error) throw sucursalesResponse.error;
  if (departamentosResponse.error) throw departamentosResponse.error;
  if (empleadosResponse.error) throw empleadosResponse.error;

  // 10. Creamos mapas para resolver las relaciones.
  const sucursales = new Map(
    (sucursalesResponse.data ?? []).map((item) => [
      item.id,
      item.nombre,
    ])
  );

  const departamentos = new Map(
    (departamentosResponse.data ?? []).map((item) => [
      item.id,
      item.nombre,
    ])
  );

  const empleados = new Map(
    (empleadosResponse.data ?? []).map((item) => [
      item.id,
      item.nombre,
    ])
  );

  // Necesitamos conocer el código visible de cada equipo.
  // Consultamos también todos los códigos porque un mantenimiento del período
  // puede corresponder a un equipo creado anteriormente.
  const { data: codigosEquipos, error: codigosError } = await supabase
    .from('equipos')
    .select('id,codigo');

  if (codigosError) throw codigosError;

  const codigoPorEquipoId = new Map(
    (codigosEquipos ?? []).map((item) => [
      item.id,
      item.codigo,
    ])
  );

  // 11. Transformamos equipos.
  const equipos: ReportEquipment[] =
    (equiposResponse.data ?? []).map((equipo) => ({
      id: equipo.id,
      codigo: equipo.codigo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      serie: equipo.serie,
      status: equipo.status,
      sucursal:
        sucursales.get(equipo.sucursal_id) ??
        'No identificada',

      departamento:
        departamentos.get(equipo.departamento_id) ??
        'No identificado',

      empleado:
        equipo.empleado_id === null
          ? 'Sin asignar'
          : empleados.get(equipo.empleado_id) ??
            'Sin asignar',

      createdAt: equipo.created_at,
    }));

  // 12. Transformamos mantenimientos.
  const mantenimientos: ReportMaintenance[] =
    (mantenimientosResponse.data ?? []).map(
      (mantenimiento) => ({
        id: mantenimiento.id,

        codigoMantenimiento:
          mantenimiento.codigo_mantenimiento,

        codigoEquipo:
          codigoPorEquipoId.get(mantenimiento.equipo_id) ??
          'No identificado',

        tipo: mantenimiento.tipo,
        status: mantenimiento.status,
        tecnico:
          mantenimiento.tecnico ??
          'No identificado',

        fechaInicio: mantenimiento.fecha_inicio,
        fechaFinalizacion:
          mantenimiento.fecha_finalizacion,
      })
    );

  return {
    equipos,
    mantenimientos,
  };
};
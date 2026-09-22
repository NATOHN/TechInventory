// 1. Cliente oficial de Supabase utilizado por TechInventory.
import { supabase } from '../lib/supabase';

// 2. Tipos internos de las filas que necesitamos consultar.
// No representan toda la tabla, únicamente las columnas necesarias para Home y Reportes.
type EquipoAnalyticsRow = {
  id: number;
  codigo: string;
  status: 'activo' | 'taller' | 'baja';
  sucursal_id: number;
  empleado_id: number | null;
  created_at: string;
};

type MantenimientoAnalyticsRow = {
  id: number;
  codigo_mantenimiento: string;
  equipo_id: number;
  tipo: 'preventivo' | 'correctivo';
  status: 'en_proceso' | 'finalizado';
  fecha_inicio: string;
  fecha_finalizacion: string | null;
  created_at: string;
};

type SucursalAnalyticsRow = {
  id: number;
  nombre: string;
};

// 3. Tipos que sí serán consumidos por Redux y las pantallas.
export type ActividadAnalyticsTipo =
  | 'equipo_registrado'
  | 'mantenimiento_iniciado'
  | 'mantenimiento_finalizado';

export type ActividadAnalytics = {
  id: string;
  tipo: ActividadAnalyticsTipo;
  codigoEquipo: string;
  fecha: string;
};

export type AnalyticsSnapshot = {
  equipos: {
    total: number;
    activos: number;
    disponibles: number;
    enUso: number;
    taller: number;
    baja: number;
  };

  mantenimientos: {
    total: number;
    enProceso: number;
    finalizados: number;
    preventivos: number;
    correctivos: number;
  };

  equiposPorSucursal: {
    sucursal: string;
    cantidad: number;
  }[];

  actividadReciente: ActividadAnalytics[];

  actualizadoEn: string;
};

// 4. Consulta Supabase y prepara una sola fotografía estadística
// que podrá ser reutilizada por Home y Reportes.
export const obtenerAnalytics = async (): Promise<AnalyticsSnapshot> => {
  // Ejecutamos las tres consultas al mismo tiempo para reducir el tiempo de espera.
  const [
    equiposResponse,
    mantenimientosResponse,
    sucursalesResponse,
  ] = await Promise.all([
    supabase
      .from('equipos')
      .select('id,codigo,status,sucursal_id,empleado_id,created_at'),

    supabase
      .from('mantenimientos')
      .select(
        'id,codigo_mantenimiento,equipo_id,tipo,status,fecha_inicio,fecha_finalizacion,created_at'
      ),

    supabase
      .from('sucursales')
      .select('id,nombre'),
  ]);

  // 5. Si alguna consulta falla, detenemos la carga para que Redux
  // pueda mostrar el error correspondiente.
  if (equiposResponse.error) throw equiposResponse.error;
  if (mantenimientosResponse.error) throw mantenimientosResponse.error;
  if (sucursalesResponse.error) throw sucursalesResponse.error;

  const equipos =
    (equiposResponse.data ?? []) as EquipoAnalyticsRow[];

  const mantenimientos =
    (mantenimientosResponse.data ?? []) as MantenimientoAnalyticsRow[];

  const sucursales =
    (sucursalesResponse.data ?? []) as SucursalAnalyticsRow[];

  // 6. Estadísticas reales de equipos.
  const activos = equipos.filter(
    (equipo) => equipo.status === 'activo'
  );

  const resumenEquipos = {
    total: equipos.length,
    activos: activos.length,

    // Un equipo activo sin empleado está disponible.
    disponibles: activos.filter(
      (equipo) => equipo.empleado_id === null
    ).length,

    // Un equipo activo con empleado se considera En uso.
    enUso: activos.filter(
      (equipo) => equipo.empleado_id !== null
    ).length,

    taller: equipos.filter(
      (equipo) => equipo.status === 'taller'
    ).length,

    baja: equipos.filter(
      (equipo) => equipo.status === 'baja'
    ).length,
  };

  // 7. Estadísticas reales de mantenimiento.
  const resumenMantenimientos = {
    total: mantenimientos.length,

    enProceso: mantenimientos.filter(
      (mantenimiento) => mantenimiento.status === 'en_proceso'
    ).length,

    finalizados: mantenimientos.filter(
      (mantenimiento) => mantenimiento.status === 'finalizado'
    ).length,

    preventivos: mantenimientos.filter(
      (mantenimiento) => mantenimiento.tipo === 'preventivo'
    ).length,

    correctivos: mantenimientos.filter(
      (mantenimiento) => mantenimiento.tipo === 'correctivo'
    ).length,
  };

  // 8. Relacionamos IDs de sucursal con sus nombres reales.
  const sucursalPorId = new Map(
    sucursales.map((sucursal) => [
      sucursal.id,
      sucursal.nombre,
    ])
  );

  // 9. Agrupamos equipos por sucursal.
  const cantidadesPorSucursal = equipos.reduce<Record<string, number>>(
    (acumulado, equipo) => {
      const nombreSucursal =
        sucursalPorId.get(equipo.sucursal_id) ??
        'Sucursal no identificada';

      acumulado[nombreSucursal] =
        (acumulado[nombreSucursal] ?? 0) + 1;

      return acumulado;
    },
    {}
  );

  const equiposPorSucursal = Object.entries(cantidadesPorSucursal)
    .map(([sucursal, cantidad]) => ({
      sucursal,
      cantidad,
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // 10. Relacionamos equipo_id con el código visible EQ-XXXX.
  const codigoEquipoPorId = new Map(
    equipos.map((equipo) => [
      equipo.id,
      equipo.codigo,
    ])
  );

  // 11. Construimos actividad real derivada de registros existentes.
  // No inventamos eventos: cada elemento proviene de una fecha almacenada en Supabase.
  const actividad: ActividadAnalytics[] = [];

  equipos.forEach((equipo) => {
    actividad.push({
      id: `equipo-${equipo.id}`,
      tipo: 'equipo_registrado',
      codigoEquipo: equipo.codigo,
      fecha: equipo.created_at,
    });
  });

  mantenimientos.forEach((mantenimiento) => {
    const codigoEquipo =
      codigoEquipoPorId.get(mantenimiento.equipo_id) ??
      'Equipo no identificado';

    actividad.push({
      id: `mantenimiento-inicio-${mantenimiento.id}`,
      tipo: 'mantenimiento_iniciado',
      codigoEquipo,
      fecha:
        mantenimiento.fecha_inicio ??
        mantenimiento.created_at,
    });

    // Un mantenimiento finalizado genera además un evento de finalización.
    if (
      mantenimiento.status === 'finalizado' &&
      mantenimiento.fecha_finalizacion
    ) {
      actividad.push({
        id: `mantenimiento-fin-${mantenimiento.id}`,
        tipo: 'mantenimiento_finalizado',
        codigoEquipo,
        fecha: mantenimiento.fecha_finalizacion,
      });
    }
  });

  // 12. Ordenamos por fecha real y Home mostrará únicamente los últimos movimientos.
  const actividadReciente = actividad
    .filter((item) => Boolean(item.fecha))
    .sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    )
    .slice(0, 5);

  return {
    equipos: resumenEquipos,
    mantenimientos: resumenMantenimientos,
    equiposPorSucursal,
    actividadReciente,
    actualizadoEn: new Date().toISOString(),
  };
};
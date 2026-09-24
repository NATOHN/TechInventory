// 1. XLSX crea el libro de Excel.
import * as XLSX from 'xlsx';

// 2. Usamos la API legacy porque writeAsStringAsync
// continúa disponible y es compatible con este flujo en Expo.
import * as FileSystem from 'expo-file-system/legacy';

// 3. Abre el menú nativo para guardar o compartir el archivo.
import * as Sharing from 'expo-sharing';

import type {
  ReportData,
  ReportPeriod,
} from '../services/reportesService';

import {
  obtenerRangoReporte,
} from '../services/reportesService';

// 4. Convierte las fechas ISO a una presentación legible.
// Formatea las fechas según el idioma seleccionado en TechInventory.
const formatearFecha = (
  fecha: string | null,
  language: 'es' | 'en'
) => {
  if (!fecha) return '';

  return new Date(fecha).toLocaleString(
    language === 'en' ? 'en-US' : 'es-HN'
  );
};

// 5. Genera y comparte el reporte real de TechInventory en formato Excel.
export const exportarReporteExcel = async (
  data: ReportData,
  periodo: ReportPeriod,
  language: 'es' | 'en'
) => {

  // Textos utilizados dentro del archivo Excel.
  // Se mantienen separados de los valores internos almacenados en Supabase.
  const textos =
    language === 'en'
      ? {
        title: 'TECHINVENTORY - GENERAL REPORT',
        period: 'Period',
        generated: 'Generated',
        currentMonth: 'This month',
        last30Days: 'Last 30 days',
        currentYear: 'This year',
        allHistory: 'All history',

        equipmentIndicators: 'EQUIPMENT INDICATORS',
        registeredEquipment: 'Registered equipment',
        inUse: 'In use',
        available: 'Available',
        inMaintenance: 'In maintenance',
        decommissioned: 'Decommissioned',

        maintenanceIndicators: 'MAINTENANCE INDICATORS',
        maintenances: 'Maintenance',
        preventive: 'Preventive',
        corrective: 'Corrective',
        inProgress: 'In progress',
        completed: 'Completed',

        code: 'Code',
        brand: 'Brand',
        model: 'Model',
        serial: 'Serial number',
        status: 'Status',
        branch: 'Branch',
        department: 'Department',
        employee: 'Employee',
        registrationDate: 'Registration date',

        maintenanceCode: 'Maintenance code',
        equipmentCode: 'Equipment code',
        type: 'Type',
        technician: 'Technician',
        startDate: 'Start date',
        completionDate: 'Completion date',

        summarySheet: 'Summary',
        equipmentSheet: 'Equipment',
        maintenanceSheet: 'Maintenance',

        unassigned: 'Unassigned',
        unidentified: 'Unidentified',

        fileName: 'Report',
        shareTitle: 'Export TechInventory report',
        sharingUnavailable: 'This device does not allow file sharing.',
      }
      : {
        title: 'TECHINVENTORY - REPORTE GENERAL',
        period: 'Período',
        generated: 'Generado',
        currentMonth: 'Este mes',
        last30Days: 'Últimos 30 días',
        currentYear: 'Este año',
        allHistory: 'Todo el historial',

        equipmentIndicators: 'INDICADORES DE EQUIPOS',
        registeredEquipment: 'Equipos registrados',
        inUse: 'En uso',
        available: 'Disponibles',
        inMaintenance: 'En mantenimiento',
        decommissioned: 'Dados de baja',

        maintenanceIndicators: 'INDICADORES DE MANTENIMIENTO',
        maintenances: 'Mantenimientos',
        preventive: 'Preventivos',
        corrective: 'Correctivos',
        inProgress: 'En proceso',
        completed: 'Finalizados',

        code: 'Código',
        brand: 'Marca',
        model: 'Modelo',
        serial: 'Serie',
        status: 'Estado',
        branch: 'Sucursal',
        department: 'Departamento',
        employee: 'Empleado',
        registrationDate: 'Fecha de registro',

        maintenanceCode: 'Código mantenimiento',
        equipmentCode: 'Código equipo',
        type: 'Tipo',
        technician: 'Técnico',
        startDate: 'Fecha inicio',
        completionDate: 'Fecha finalización',

        summarySheet: 'Resumen',
        equipmentSheet: 'Equipos',
        maintenanceSheet: 'Mantenimientos',

        unassigned: 'Sin asignar',
        unidentified: 'No identificado',

        fileName: 'Reporte',
        shareTitle: 'Exportar reporte TechInventory',
        sharingUnavailable: 'El dispositivo no permite compartir archivos.',
      };

  const etiquetaPeriodo =
    periodo === 'mes_actual'
      ? textos.currentMonth
      : periodo === 'ultimos_30'
        ? textos.last30Days
        : periodo === 'anio_actual'
          ? textos.currentYear
          : textos.allHistory;

  const rango = obtenerRangoReporte(periodo);

  // 6. Resumen general del período seleccionado.
  const activos = data.equipos.filter(
    (equipo) => equipo.status === 'activo'
  );

  const resumen = [
    [textos.title],
    [],
    [textos.period, etiquetaPeriodo],
    [
      textos.generated,
      new Date().toLocaleString(
        language === 'en' ? 'en-US' : 'es-HN'
      ),
    ],
    [],
    [textos.equipmentIndicators],
    [textos.registeredEquipment, data.equipos.length],

    [
      textos.inUse,
      activos.filter(
        (equipo) => equipo.empleado !== 'Sin asignar'
      ).length,
    ],

    [
      textos.available,
      activos.filter(
        (equipo) => equipo.empleado === 'Sin asignar'
      ).length,
    ],

    [
      textos.inMaintenance,
      data.equipos.filter(
        (equipo) => equipo.status === 'taller'
      ).length,
    ],

    [
      textos.decommissioned,
      data.equipos.filter(
        (equipo) => equipo.status === 'baja'
      ).length,
    ],

    [],
    [textos.maintenanceIndicators],
    [textos.maintenances, data.mantenimientos.length],

    [
      textos.preventive,
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.tipo === 'preventivo'
      ).length,
    ],

    [
      textos.corrective,
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.tipo === 'correctivo'
      ).length,
    ],

    [
      textos.inProgress,
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.status === 'en_proceso'
      ).length,
    ],

    [
      textos.completed,
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.status === 'finalizado'
      ).length,
    ],
  ];

  const equiposExcel = data.equipos.map((equipo) => ({
    [textos.code]: equipo.codigo,
    [textos.brand]: equipo.marca,
    [textos.model]: equipo.modelo,
    [textos.serial]: equipo.serie,

    [textos.status]:
      equipo.status === 'taller'
        ? textos.inMaintenance
        : equipo.status === 'baja'
          ? textos.decommissioned
          : equipo.empleado !== 'Sin asignar'
            ? textos.inUse
            : textos.available,

    [textos.branch]:
      equipo.sucursal === 'No identificada'
        ? textos.unidentified
        : equipo.sucursal,

    [textos.department]:
      equipo.departamento === 'No identificado'
        ? textos.unidentified
        : equipo.departamento,

    [textos.employee]:
      equipo.empleado === 'Sin asignar'
        ? textos.unassigned
        : equipo.empleado,

    [textos.registrationDate]:
      formatearFecha(equipo.createdAt, language),
  }));

  // 8. Hoja detallada de mantenimientos.
  const mantenimientosExcel =
    data.mantenimientos.map((mantenimiento) => ({
      [textos.maintenanceCode]:
        mantenimiento.codigoMantenimiento,

      [textos.equipmentCode]:
        mantenimiento.codigoEquipo === 'No identificado'
          ? textos.unidentified
          : mantenimiento.codigoEquipo,

      [textos.type]:
        mantenimiento.tipo === 'preventivo'
          ? textos.preventive
          : textos.corrective,

      [textos.status]:
        mantenimiento.status === 'en_proceso'
          ? textos.inProgress
          : textos.completed,

      [textos.technician]:
        mantenimiento.tecnico === 'No identificado'
          ? textos.unidentified
          : mantenimiento.tecnico,

      [textos.startDate]:
        formatearFecha(
          mantenimiento.fechaInicio,
          language
        ),

      [textos.completionDate]:
        formatearFecha(
          mantenimiento.fechaFinalizacion,
          language
        ),
    }));

  // 9. Creamos el libro y sus tres hojas.
  const workbook = XLSX.utils.book_new();

  const resumenSheet =
    XLSX.utils.aoa_to_sheet(resumen);

  const equiposSheet =
    XLSX.utils.json_to_sheet(equiposExcel);

  const mantenimientosSheet =
    XLSX.utils.json_to_sheet(mantenimientosExcel);

  XLSX.utils.book_append_sheet(
    workbook,
    resumenSheet,
    textos.summarySheet
  );

  XLSX.utils.book_append_sheet(
    workbook,
    equiposSheet,
    textos.equipmentSheet
  );

  XLSX.utils.book_append_sheet(
    workbook,
    mantenimientosSheet,
    textos.maintenanceSheet
  );

  // 10. Generamos el archivo como Base64.
  const base64 = XLSX.write(workbook, {
    type: 'base64',
    bookType: 'xlsx',
  });

  const fechaArchivo =
    new Date()
      .toISOString()
      .slice(0, 10);

  const uri =
    `${FileSystem.cacheDirectory}` +
    `TechInventory_${textos.fileName}_${fechaArchivo}.xlsx`;

  // 11. Escribimos temporalmente el archivo.
  await FileSystem.writeAsStringAsync(
    uri,
    base64,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );

  // 12. Abrimos las opciones del teléfono.
  const disponible =
    await Sharing.isAvailableAsync();

  if (!disponible) {
    throw new Error(textos.sharingUnavailable);
  }

  await Sharing.shareAsync(uri, {
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    dialogTitle: textos.shareTitle,

    UTI:
      'org.openxmlformats.spreadsheetml.sheet',
  });
};
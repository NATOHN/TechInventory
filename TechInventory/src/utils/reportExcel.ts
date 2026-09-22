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
const formatearFecha = (fecha: string | null) => {
  if (!fecha) return '';

  return new Date(fecha).toLocaleString();
};

// 5. Genera y comparte el reporte real de TechInventory en formato Excel.
export const exportarReporteExcel = async (
  data: ReportData,
  periodo: ReportPeriod
) => {
  const rango = obtenerRangoReporte(periodo);

  // 6. Resumen general del período seleccionado.
  const activos = data.equipos.filter(
    (equipo) => equipo.status === 'activo'
  );

  const resumen = [
    ['TECHINVENTORY - REPORTE GENERAL'],
    [],
    ['Período', rango.etiqueta],
    ['Generado', new Date().toLocaleString()],
    [],
    ['INDICADORES DE EQUIPOS'],
    ['Equipos registrados', data.equipos.length],

    [
      'En uso',
      activos.filter(
        (equipo) => equipo.empleado !== 'Sin asignar'
      ).length,
    ],

    [
      'Disponibles',
      activos.filter(
        (equipo) => equipo.empleado === 'Sin asignar'
      ).length,
    ],

    [
      'En mantenimiento',
      data.equipos.filter(
        (equipo) => equipo.status === 'taller'
      ).length,
    ],

    [
      'Dados de baja',
      data.equipos.filter(
        (equipo) => equipo.status === 'baja'
      ).length,
    ],

    [],
    ['INDICADORES DE MANTENIMIENTO'],
    ['Mantenimientos', data.mantenimientos.length],

    [
      'Preventivos',
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.tipo === 'preventivo'
      ).length,
    ],

    [
      'Correctivos',
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.tipo === 'correctivo'
      ).length,
    ],

    [
      'En proceso',
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.status === 'en_proceso'
      ).length,
    ],

    [
      'Finalizados',
      data.mantenimientos.filter(
        (mantenimiento) =>
          mantenimiento.status === 'finalizado'
      ).length,
    ],
  ];

  // 7. Hoja detallada de equipos.
  const equiposExcel = data.equipos.map((equipo) => ({
    Código: equipo.codigo,
    Marca: equipo.marca,
    Modelo: equipo.modelo,
    Serie: equipo.serie,

    Estado:
      equipo.status === 'taller'
        ? 'Mantenimiento'
        : equipo.status === 'baja'
          ? 'Baja'
          : equipo.empleado !== 'Sin asignar'
            ? 'En uso'
            : 'Disponible',

    Sucursal: equipo.sucursal,
    Departamento: equipo.departamento,
    Empleado: equipo.empleado,
    'Fecha de registro': formatearFecha(equipo.createdAt),
  }));

  // 8. Hoja detallada de mantenimientos.
  const mantenimientosExcel =
    data.mantenimientos.map((mantenimiento) => ({
      'Código mantenimiento':
        mantenimiento.codigoMantenimiento,

      'Código equipo':
        mantenimiento.codigoEquipo,

      Tipo:
        mantenimiento.tipo === 'preventivo'
          ? 'Preventivo'
          : 'Correctivo',

      Estado:
        mantenimiento.status === 'en_proceso'
          ? 'En proceso'
          : 'Finalizado',

      Técnico: mantenimiento.tecnico,

      'Fecha inicio':
        formatearFecha(mantenimiento.fechaInicio),

      'Fecha finalización':
        formatearFecha(
          mantenimiento.fechaFinalizacion
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
    'Resumen'
  );

  XLSX.utils.book_append_sheet(
    workbook,
    equiposSheet,
    'Equipos'
  );

  XLSX.utils.book_append_sheet(
    workbook,
    mantenimientosSheet,
    'Mantenimientos'
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
    `TechInventory_Reporte_${fechaArchivo}.xlsx`;

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
    throw new Error(
      'El dispositivo no permite compartir archivos.'
    );
  }

  await Sharing.shareAsync(uri, {
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    dialogTitle:
      'Exportar reporte TechInventory',

    UTI:
      'org.openxmlformats.spreadsheetml.sheet',
  });
};
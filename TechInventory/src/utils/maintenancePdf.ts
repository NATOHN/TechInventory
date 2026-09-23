
// Genera la constancia de mantenimiento en PDF tamaño carta.
import * as Print from 'expo-print';
// Permite renombrar el archivo temporal generado por expo-print.
import { File } from 'expo-file-system';

import type { Maintenance } from '../redux/maintenanceSlice';
import type { Equipment } from '../redux/equipmentSlice';

export type PdfLanguage = 'es' | 'en';

// Evita que caracteres escritos por el usuario dañen el HTML del documento.
const escapeHtml = (value?: string) =>
  (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Formatea las fechas según el idioma actual de la aplicación.
const formatPdfDate = (date?: string, language: PdfLanguage = 'es') => {
  if (!date) return language === 'en' ? 'Not available' : 'No disponible';

  return new Date(date).toLocaleString(language === 'en' ? 'en-US' : 'es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Traduce únicamente los resultados controlados por la aplicación.
const getFinalStatusLabel = (status: string | undefined, language: PdfLanguage) => {
  if (!status) return language === 'en' ? 'Not specified' : 'No especificado';

  if (language === 'es') return status;

  const statusTranslations: Record<string, string> = {
    'Operativo': 'Operational',
    'Requiere seguimiento': 'Requires follow-up',
    'Fuera de servicio': 'Out of service',
  };

  return statusTranslations[status] ?? status;
};

// Traduce las tareas predefinidas del checklist sin modificar textos escritos por el técnico.
const getChecklistLabel = (label: string, language: PdfLanguage) => {
  if (language === 'es') return label;

  const checklistTranslations: Record<string, string> = {
    'Limpieza interna': 'Internal cleaning',
    'Revisión de hardware': 'Hardware inspection',
    'Actualización de software': 'Software update',
    'Pruebas de funcionamiento': 'Functionality testing',
    'Observaciones generales': 'General observations',
  };

  return checklistTranslations[label] ?? label;
};

// Genera el PDF y devuelve la URI temporal creada por Expo.
export const generateMaintenancePdf = async (
  maintenance: Maintenance,
  equipment: Equipment,
  language: PdfLanguage = 'es'
): Promise<string> => {
  // Código visible del mantenimiento.
  // Los registros nuevos utilizan MT-0001, MT-0002...
  // Si abrimos un registro antiguo, usamos su id como respaldo.
  const documentCode = maintenance.codigoMantenimiento ?? maintenance.id;
  const isEnglish = language === 'en';

  // Solo incluimos las tareas que realmente fueron realizadas.
  const completedTasks = (maintenance.checklist ?? []).filter((item) => item.checked);

  // Las tareas predefinidas se traducen según el idioma del PDF.
  const tasksHtml =
    completedTasks.length > 0
      ? completedTasks
        .map((item) => `<li>${escapeHtml(getChecklistLabel(item.label, language))}</li>`)
        .join('')
      : `<p class="empty">${isEnglish ? 'No tasks recorded.' : 'Sin tareas registradas.'}</p>`;


  // Construimos la lista de repuestos utilizados.
  const partsHtml =
    (maintenance.repuestos ?? []).length > 0
      ? maintenance.repuestos
        .map(
          (part) =>
            `<tr>
                <td>${escapeHtml(part.nombre)}</td>
                <td class="quantity">${part.cantidad}</td>
              </tr>`
        )
        .join('')
      : `<tr><td colspan="2" class="empty">${isEnglish ? 'No parts used.' : 'No se utilizaron repuestos.'}</td></tr>`;

  // La firma puede venir directamente de la captura como data-uri
// o desde Supabase Storage mediante una URL privada temporal.
const firmaDisponible =
  maintenance.firmaBase64?.startsWith('data:image/') ||
  maintenance.firmaBase64?.startsWith('https://') ||
  maintenance.firmaBase64?.startsWith('http://');

const signatureHtml =
  firmaDisponible
    ? `<img src="${maintenance.firmaBase64}" class="signature" />`
    : `<div class="signature-missing">${isEnglish ? 'Signature unavailable' : 'Firma no disponible'}</div>`;
 

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @page { size: Letter; margin: 36pt; }

          * { box-sizing: border-box; }

          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1F2937;
            font-size: 11pt;
            line-height: 1.4;
            margin: 0;
          }

          .header {
            border-bottom: 2px solid #2563EB;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }

          .brand {
            font-size: 20pt;
            font-weight: bold;
            color: #2563EB;
            margin: 0;
          }

          .subtitle {
            font-size: 10pt;
            color: #6B7280;
            margin-top: 3px;
          }

          .document-title {
            font-size: 16pt;
            font-weight: bold;
            margin: 0 0 4px 0;
          }

          .document-id {
            color: #6B7280;
            font-size: 9.5pt;
          }

          .section {
            border: 1px solid #D1D5DB;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 14px;
            page-break-inside: avoid;
          }

          .section-title {
            font-size: 11pt;
            font-weight: bold;
            color: #2563EB;
            margin: 0 0 10px 0;
          }

          .info-table, .parts-table {
            width: 100%;
            border-collapse: collapse;
          }

          .info-table td {
            padding: 4px 0;
            vertical-align: top;
          }

          .label {
            width: 34%;
            color: #6B7280;
            font-weight: bold;
          }

          .parts-table th, .parts-table td {
            border-bottom: 1px solid #E5E7EB;
            padding: 6px;
            text-align: left;
          }

          .parts-table th {
            background: #F3F4F6;
          }

          .quantity {
            width: 90px;
            text-align: center !important;
          }

          ul {
            padding-left: 20px;
            margin: 5px 0 0 0;
          }

          li { margin-bottom: 4px; }

          .description {
            white-space: pre-wrap;
          }

          .empty {
            color: #6B7280;
            font-style: italic;
          }

          .signature-area {
            margin-top: 12px;
            text-align: center;
          }

          .signature {
            width: 220px;
            height: 90px;
            object-fit: contain;
            margin-bottom: 4px;
          }

          .signature-missing {
            height: 80px;
            padding-top: 30px;
            color: #9CA3AF;
          }

          .signature-line {
            width: 260px;
            border-top: 1px solid #374151;
            margin: 0 auto 5px auto;
          }

          .signed-name {
            font-weight: bold;
          }

          .footer {
            margin-top: 18px;
            padding-top: 8px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 8.5pt;
            text-align: center;
          }
        </style>
      </head>

      <body>
        <!-- Encabezado principal de la constancia. -->
        <div class="header">
          <p class="brand">TechInventory</p>
          <p class="subtitle">
            ${isEnglish ? 'Equipment inventory and maintenance management' : 'Gestión de inventario y mantenimiento de equipos'}
          </p>
        </div>

        <p class="document-title">
          ${isEnglish ? 'Maintenance Certificate' : 'Constancia de mantenimiento'}
        </p>

        <!-- Mostramos el consecutivo visible del mantenimiento. -->
        <p class="document-id">
          ${isEnglish ? 'Maintenance No.' : 'Mantenimiento N.º'} ${escapeHtml(documentCode)}
        </p>

        <!-- Datos del equipo. -->
        <div class="section">
          <p class="section-title">${isEnglish ? 'Equipment information' : 'Información del equipo'}</p>

          <table class="info-table">
            <tr><td class="label">${isEnglish ? 'Code' : 'Código'}</td><td>${escapeHtml(equipment.codigo)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Brand / Model' : 'Marca / modelo'}</td><td>${escapeHtml(`${equipment.marca} ${equipment.modelo}`)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Serial number' : 'Número de serie'}</td><td>${escapeHtml(equipment.serie)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Branch' : 'Sucursal'}</td><td>${escapeHtml(equipment.sucursal)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Department' : 'Departamento'}</td><td>${escapeHtml(equipment.departamento)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Assigned employee' : 'Empleado asignado'}</td><td>${escapeHtml(maintenance.firmadoPorNombre || equipment.empleadoAsignado)}</td></tr>
          </table>
        </div>

        <!-- Información general del mantenimiento. -->
        <div class="section">
          <p class="section-title">${isEnglish ? 'Maintenance information' : 'Información del mantenimiento'}</p>

          <table class="info-table">
            <tr>
              <td class="label">${isEnglish ? 'Type' : 'Tipo'}</td>
              <td>
                ${maintenance.tipo === 'preventivo'
      ? isEnglish ? 'Preventive' : 'Preventivo'
      : isEnglish ? 'Corrective' : 'Correctivo'
    }
              </td>
            </tr>

            <tr><td class="label">${isEnglish ? 'Technician' : 'Técnico'}</td><td>${escapeHtml(maintenance.tecnico)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Start date' : 'Fecha de inicio'}</td><td>${formatPdfDate(maintenance.fechaInicio, language)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Completion date' : 'Fecha de finalización'}</td><td>${formatPdfDate(maintenance.fechaFinalizacion, language)}</td></tr>
            <tr><td class="label">${isEnglish ? 'Final result' : 'Resultado final'}</td><td>${escapeHtml(getFinalStatusLabel(maintenance.estadoFinal, language))}</td></tr>
          </table>
        </div>

        <!-- Trabajo realizado. -->
        <div class="section">
          <p class="section-title">${isEnglish ? 'Work performed' : 'Trabajo realizado'}</p>
          <div class="description">${escapeHtml(maintenance.descripcion)}</div>

          <p class="section-title" style="margin-top: 14px;">
            ${isEnglish ? 'Completed tasks' : 'Tareas realizadas'}
          </p>

          ${completedTasks.length > 0 ? `<ul>${tasksHtml}</ul>` : tasksHtml}
        </div>

        <!-- Repuestos utilizados. -->
        <div class="section">
          <p class="section-title">${isEnglish ? 'Parts used' : 'Repuestos utilizados'}</p>

          <table class="parts-table">
            <thead>
              <tr>
                <th>${isEnglish ? 'Part' : 'Repuesto'}</th>
                <th class="quantity">${isEnglish ? 'Quantity' : 'Cantidad'}</th>
              </tr>
            </thead>
            <tbody>${partsHtml}</tbody>
          </table>
        </div>

        ${maintenance.motivoBaja
      ? `
              <div class="section">
                <p class="section-title">${isEnglish ? 'Deactivation reason' : 'Motivo de baja'}</p>
                <div class="description">${escapeHtml(maintenance.motivoBaja)}</div>
              </div>
            `
      : ''
    }

        <!-- Firma de conformidad almacenada al finalizar el mantenimiento. -->
        <div class="section">
          <p class="section-title">${isEnglish ? 'Acceptance signature' : 'Firma de conformidad'}</p>

          <div class="signature-area">
            ${signatureHtml}

            <div class="signature-line"></div>

            <div class="signed-name">
              ${escapeHtml(maintenance.firmadoPorNombre || equipment.empleadoAsignado)}
            </div>

            <div>
              ${isEnglish ? 'Signature date' : 'Fecha de firma'}:
              ${formatPdfDate(maintenance.fechaFirma, language)}
            </div>
          </div>
        </div>

        <div class="footer">
          ${isEnglish
      ? 'Document generated by TechInventory.'
      : 'Documento generado por TechInventory.'}
        </div>
      </body>
    </html>
  `;

  // 612 x 792 puntos corresponden al formato US Letter.
  const { uri } = await Print.printToFileAsync({
    html,
    width: 612,
    height: 792,
  });

  // Tomamos el archivo temporal generado por Expo.
  const temporaryFile = new File(uri);

  // Nombre legible de la constancia.
  // Ejemplo: Constancia_MT-0001_EQ-0004.pdf
  const fileName = `Constancia_${documentCode}_${equipment.codigo}.pdf`;

  // Creamos la referencia al nombre definitivo dentro de la misma carpeta temporal.
  const finalFile = new File(
    temporaryFile.parentDirectory,
    fileName
  );

  // Si la misma constancia ya fue generada anteriormente,
  // eliminamos la copia anterior para poder regenerarla sin errores.
  if (finalFile.exists) {
    finalFile.delete();
  }

  // Movemos el PDF temporal al nombre definitivo.
  temporaryFile.move(finalFile);

  // Devolvemos la URI del PDF ya renombrado.
  return finalFile.uri;
};
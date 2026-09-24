
// Importamos solamente el tipo del mantenimiento.
import type { Maintenance } from '../redux/maintenanceSlice';

/**
 * Genera temporalmente el siguiente código visible de mantenimiento.
 *
 * Esta lógica se utilizará únicamente mientras trabajamos
 * con Redux + AsyncStorage.
 *
 * Más adelante Supabase será responsable del consecutivo.
 */
export const generateNextMaintenanceCode = (
  maintenances: Maintenance[]
): string => {
  // Tomamos únicamente los nuevos códigos visibles MT-0001, MT-0002, etc.
  // Los IDs antiguos creados con Date.now() no participan.
  const numerosExistentes = maintenances
    .map((maintenance) => maintenance.codigoMantenimiento)
    .filter((codigo): codigo is string => Boolean(codigo))
    .map((codigo) => {
      const match = codigo.match(/^MT-(\d+)$/);
      return match ? Number(match[1]) : 0;
    });

  // Si todavía no existe ningún código nuevo, comenzamos en cero.
  const ultimoNumero =
    numerosExistentes.length > 0
      ? Math.max(...numerosExistentes)
      : 0;

  const siguienteNumero = ultimoNumero + 1;

  // Ejemplo: 1 → MT-0001.
  return `MT-${String(siguienteNumero).padStart(4, '0')}`;
};
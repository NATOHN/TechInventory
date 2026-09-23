// Cliente principal utilizado para comunicarnos con Supabase.
import { supabase } from "../lib/supabase";

// Convierte el contenido Base64 de la firma a ArrayBuffer,
// formato compatible con Supabase Storage.
import { decode } from "base64-arraybuffer";

// Bucket privado creado exclusivamente para las firmas.
const MAINTENANCE_SIGNATURES_BUCKET = "maintenance-signatures";


// Extrae únicamente el contenido Base64 de un data-uri.
// Ejemplo recibido:
// data:image/png;base64,iVBORw0KGgo...
const extraerBase64 = (dataUri: string): string => {
    const partes = dataUri.split(",");

    if (partes.length < 2 || !partes[1]) {
        throw new Error("La firma capturada no contiene un Base64 válido.");
    }

    return partes[1];
};


// Sube la firma de un mantenimiento al bucket privado.
// En PostgreSQL guardaremos únicamente la ruta devuelta por esta función.
export const subirFirmaMantenimiento = async (
    codigoMantenimiento: string,
    firmaDataUri: string
): Promise<string> => {

    // Solo procesamos la firma local capturada originalmente por ViewShot.
    if (!firmaDataUri.startsWith("data:image/")) {
        throw new Error("La firma proporcionada no es una imagen válida.");
    }

    const base64 = extraerBase64(firmaDataUri);
    const archivo = decode(base64);

    // Cada mantenimiento tendrá una sola firma definitiva.
    // Ejemplo:
    // mantenimientos/MT-0001/firma.png
    const path = `mantenimientos/${codigoMantenimiento}/firma.png`;

    const { error } = await supabase.storage
        .from(MAINTENANCE_SIGNATURES_BUCKET)
        .upload(path, archivo, {
            contentType: "image/png",

            // Si por alguna sincronización se vuelve a enviar la misma firma,
            // reemplazamos el archivo en lugar de crear duplicados.
            upsert: true,
        });

    if (error) throw error;

    return path;
};


// Obtiene una URL temporal para poder visualizar una firma privada.
// La ruta permanente continúa almacenada en firma_path.
export const obtenerUrlFirmaMantenimiento = async (
    firmaPath?: string | null
): Promise<string | undefined> => {

    if (!firmaPath) return undefined;

    const { data, error } = await supabase.storage
        .from(MAINTENANCE_SIGNATURES_BUCKET)
        .createSignedUrl(
            firmaPath,

            // La URL podrá utilizarse durante una hora.
            // Cuando volvamos a consultar Supabase generaremos una nueva.
            60 * 60
        );

    if (error) throw error;

    return data.signedUrl;
};
// Cliente único de Supabase utilizado por TechInventory.
import { supabase } from "../lib/supabase";

// Tipo actual de fotografía utilizado por Equipment.
import type { Equipment } from "../redux/equipmentSlice";

// Bucket creado en Supabase Storage para las fotografías de los equipos.
const EQUIPMENT_IMAGES_BUCKET = "equipment-images";

// Obtiene una URI utilizable a partir del ImageSourcePropType de React Native.
const obtenerUriFoto = (foto: Equipment["foto"]): string | null => {
    // Algunas fuentes pueden llegar como arreglo.
    const fuente = Array.isArray(foto) ? foto[0] : foto;

    // Los require("../img/...") son números y no representan archivos
    // seleccionados por el usuario que debamos subir a Supabase.
    if (!fuente || typeof fuente !== "object" || !("uri" in fuente)) {
        return null;
    }

    return typeof fuente.uri === "string" ? fuente.uri : null;
};

// Determina extensión y Content-Type de la fotografía seleccionada.
const obtenerFormatoImagen = (uri: string) => {
    const uriLimpia = uri.split("?")[0];
    const extensionOriginal = uriLimpia.split(".").pop()?.toLowerCase();

    if (extensionOriginal === "png") {
        return { extension: "png", contentType: "image/png" };
    }

    if (extensionOriginal === "webp") {
        return { extension: "webp", contentType: "image/webp" };
    }

    if (extensionOriginal === "heic") {
        return { extension: "heic", contentType: "image/heic" };
    }

    // jpg, jpeg o cualquier formato sin extensión reconocible
    // utilizarán JPEG como formato de respaldo.
    return { extension: "jpg", contentType: "image/jpeg" };
};

// Sube una fotografía local de un equipo a Supabase Storage.
// Si la fotografía ya es una URL remota, simplemente la conserva.
export const subirFotoEquipo = async (
    codigoEquipo: string,
    foto: Equipment["foto"]
): Promise<string | null> => {
    const uri = obtenerUriFoto(foto);

    // No existe una fotografía utilizable.
    if (!uri) return null;

    // Si ya viene de Supabase/Internet no debemos volver a subirla.
    if (uri.startsWith("http://") || uri.startsWith("https://")) {
        return uri;
    }

    // Convertimos la URI local entregada por ImagePicker
    // a bytes que Supabase Storage pueda recibir.
    const respuesta = await fetch(uri);

    if (!respuesta.ok) {
        throw new Error("No se pudo leer la fotografía seleccionada.");
    }

    const archivo = await respuesta.arrayBuffer();
    const formato = obtenerFormatoImagen(uri);

    // Usamos una ruta nueva cuando cambia la fotografía.
    // El timestamp evita problemas de caché al editar una imagen.
    const path =
        `equipos/${codigoEquipo}/foto-${Date.now()}.${formato.extension}`;

    const { error } = await supabase.storage
        .from(EQUIPMENT_IMAGES_BUCKET)
        .upload(path, archivo, {
            contentType: formato.contentType,
            upsert: false,
        });

    if (error) throw error;

    // Como el bucket es público obtenemos una URL que cualquier
    // dispositivo de TechInventory puede utilizar posteriormente.
    const { data } = supabase.storage
        .from(EQUIPMENT_IMAGES_BUCKET)
        .getPublicUrl(path);

    return data.publicUrl;
};
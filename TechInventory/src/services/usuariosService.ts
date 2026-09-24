// Importamos el cliente principal utilizado por TechInventory.
import { supabase } from "../lib/supabase";

// Convierte el base64 generado por ImagePicker al formato que acepta Supabase Storage.
import { decode } from "base64-arraybuffer";

// Importamos solamente el tipo para mantener exactamente
// la estructura que consume actualmente Redux.
import type { AppUser } from "../redux/usersSlice";

// Obtiene todos los usuarios activos registrados en TechInventory.
// Auth controla la sesión y public.usuarios contiene los datos propios de la aplicación.
export const obtenerUsuarios = async (): Promise<AppUser[]> => {
    const { data, error } = await supabase
        .from("usuarios")
        .select(`
            id,
            empleado_id,
            nombre_completo,
            correo,
            rol,
            foto_perfil,
            created_at
        `)
        .eq("activo", true)
        .order("nombre_completo", { ascending: true });

    // Propagamos cualquier problema para que Redux pueda manejarlo.
    if (error) throw error;

    // Convertimos snake_case de PostgreSQL al formato que ya utiliza React Native.
    return (data ?? []).map((usuario) => ({
        id: usuario.id,
        empleadoId: usuario.empleado_id ?? undefined,
        nombreCompleto: usuario.nombre_completo,
        correo: usuario.correo,
        rol: usuario.rol as AppUser["rol"],
        fotoPerfil: usuario.foto_perfil ?? undefined,
        fechaCreacion: usuario.created_at,
    }));
};

// Datos necesarios para que un administrador cree una cuenta real.
// La contraseña solamente viajará hacia la Edge Function y nunca se guardará en Redux.
export type CrearUsuarioInput = {
    empleadoId: number;
    correo: string;
    password: string;
    rol: "tecnico" | "administrador";
};

// Solicita a la Edge Function la creación segura de:
// 1. la cuenta dentro de Supabase Auth;
// 2. el perfil relacionado dentro de public.usuarios.
export const crearUsuarioEnSupabase = async (
    datos: CrearUsuarioInput
): Promise<void> => {
    const { data, error } = await supabase.functions.invoke(
        "crear-usuario",
        {
            body: {
                empleadoId: datos.empleadoId,
                correo: datos.correo.trim().toLowerCase(),
                password: datos.password,
                rol: datos.rol,
            },
        }
    );

    // Los errores de transporte llegan en error.
    if (error) throw error;

    // La función también puede devolver un mensaje propio de validación.
    if (data?.error) {
        throw new Error(data.error);
    }
};

// Datos que un usuario puede modificar de su propio perfil.
// No permitimos cambiar rol, empleado_id ni otros datos administrativos.
export type ActualizarPerfilInput = {
    usuarioId: string;
    nombreCompleto: string;
    fotoPerfil?: string;
};

// Actualiza únicamente los datos permitidos del usuario autenticado.
export const actualizarPerfilEnSupabase = async (
    datos: ActualizarPerfilInput
): Promise<Pick<AppUser, "id" | "nombreCompleto" | "fotoPerfil">> => {
    const nombreLimpio = datos.nombreCompleto.trim();

    if (!nombreLimpio) {
        throw new Error("El nombre completo es obligatorio.");
    }

    const { data, error } = await supabase
        .from("usuarios")
        .update({
            nombre_completo: nombreLimpio,
            foto_perfil: datos.fotoPerfil ?? null,
        })
        .eq("id", datos.usuarioId)
        .select("id, nombre_completo, foto_perfil")
        .single();

    if (error) {
        console.log("Error de Supabase al actualizar perfil:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        });

        throw new Error(error.message);
    }

    return {
        id: data.id,
        nombreCompleto: data.nombre_completo,
        fotoPerfil: data.foto_perfil ?? undefined,
    };
};

// Sube o reemplaza la fotografía del propio usuario en Supabase Storage.
// Cada usuario posee una carpeta identificada con su UUID de Supabase Auth.
export const subirFotoPerfilEnStorage = async (
    usuarioId: string,
    fotoBase64: string,
    mimeType: string
): Promise<string> => {
    // Utilizamos una ruta estable para reemplazar la foto anterior
    // y evitar acumular imágenes cada vez que se cambia el perfil.
    const fotoPath = `${usuarioId}/avatar`;

    const { error } = await supabase.storage
        .from("fotos-perfil")
        .upload(
            fotoPath,
            decode(fotoBase64),
            {
                contentType: mimeType || "image/jpeg",
                cacheControl: "3600",
                upsert: true,
            }
        );

    if (error) {
        console.log("Error de Supabase Storage al subir foto:", error);
        throw new Error(error.message);
    }

    // El bucket es público únicamente para poder mostrar el avatar directamente.
    const { data } = supabase.storage
        .from("fotos-perfil")
        .getPublicUrl(fotoPath);

    // El parámetro evita que React Native siga mostrando una versión
    // almacenada en caché después de cambiar la foto.
    return `${data.publicUrl}?v=${Date.now()}`;
};
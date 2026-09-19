// Importamos el cliente principal utilizado por TechInventory.
import { supabase } from "../lib/supabase";

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
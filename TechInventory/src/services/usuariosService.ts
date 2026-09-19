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
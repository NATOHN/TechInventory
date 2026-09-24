// Cargamos los tipos necesarios del entorno de ejecución de Supabase Edge Functions.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// 1. Importamos Supabase únicamente dentro de la Edge Function.
// Este código se ejecuta en el servidor y nunca dentro de Expo.
import { createClient } from "npm:@supabase/supabase-js@2";


// 2. Cabeceras básicas necesarias para aceptar llamadas desde el cliente.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 3. La función recibe las solicitudes enviadas por TechInventory.
Deno.serve(async (req) => {
  // Respondemos las solicitudes OPTIONS utilizadas por clientes HTTP.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 4. Solo permitimos creación de usuarios mediante POST.
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Método no permitido." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Obtenemos la sesión enviada automáticamente por Supabase desde la app.
    const authorization = req.headers.get("Authorization");

    if (!authorization) {
      return new Response(
        JSON.stringify({ error: "No existe una sesión autenticada." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Obtenemos las claves que Supabase proporciona automáticamente a la función.
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const publishableKeys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")!);
    const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!);

    // 7. Este cliente representa al usuario que está realizando la solicitud.
    // Mantiene RLS y nos permitirá comprobar que realmente sea administrador.
    const supabaseUser = createClient(
      supabaseUrl,
      publishableKeys.default,
      {
        global: { headers: { Authorization: authorization } },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // 8. Verificamos realmente el JWT recibido.
    const {
      data: { user: usuarioActual },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !usuarioActual) {
      return new Response(
        JSON.stringify({ error: "La sesión no es válida." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 9. Confirmamos que la cuenta autenticada tenga rol administrador.
    const { data: perfilActual, error: perfilError } = await supabaseUser
      .from("usuarios")
      .select("id, rol, activo")
      .eq("id", usuarioActual.id)
      .single();

    if (
      perfilError ||
      !perfilActual ||
      perfilActual.rol !== "administrador" ||
      !perfilActual.activo
    ) {
      return new Response(
        JSON.stringify({ error: "Solo un administrador puede crear usuarios." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 10. Recibimos únicamente la información necesaria desde Expo.
    // El nombre del empleado NO se recibe porque lo obtendremos directamente de PostgreSQL.
    const { empleadoId, correo, password, rol } = await req.json();

    if (!empleadoId || !correo || !password || !rol) {
      return new Response(
        JSON.stringify({ error: "Faltan datos obligatorios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (rol !== "tecnico" && rol !== "administrador") {
      return new Response(
        JSON.stringify({ error: "El rol seleccionado no es válido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "La contraseña debe contener al menos 8 caracteres." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 11. Creamos un cliente administrativo únicamente dentro del servidor.
    // La clave secreta nunca se expone al dispositivo móvil.
    const supabaseAdmin = createClient(
      supabaseUrl,
      secretKeys.default,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // 12. Obtenemos el empleado directamente de PostgreSQL.
    // Así evitamos que el cliente pueda enviar un nombre diferente.
    const { data: empleado, error: empleadoError } = await supabaseAdmin
      .from("empleados")
      .select("id, nombre, activo")
      .eq("id", empleadoId)
      .single();

    if (empleadoError || !empleado || !empleado.activo) {
      return new Response(
        JSON.stringify({ error: "El empleado seleccionado no es válido o está inactivo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const correoNormalizado = String(correo).trim().toLowerCase();

    // 13. Creamos la cuenta real dentro de Supabase Auth.
    // Como el administrador proporciona la cuenta directamente,
    // dejamos el correo confirmado desde su creación.
    const { data: authData, error: crearAuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email: correoNormalizado,
        password,
        email_confirm: true,

        // Estos metadatos son complementarios.
        // La fuente propia de TechInventory continuará siendo public.usuarios.
        user_metadata: {
          empleado_id: empleado.id,
          nombre_completo: empleado.nombre,
          rol,
        },
      });

    if (crearAuthError || !authData.user) {
      return new Response(
        JSON.stringify({
          error: crearAuthError?.message ?? "No fue posible crear la cuenta.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 14. Creamos el perfil propio de TechInventory relacionado con auth.users.
    const { error: perfilNuevoError } = await supabaseAdmin
      .from("usuarios")
      .insert({
        id: authData.user.id,
        empleado_id: empleado.id,
        nombre_completo: empleado.nombre,
        correo: correoNormalizado,
        rol,
        activo: true,

        // Conservamos evidencia del administrador que creó la cuenta.
        registrado_por_id: usuarioActual.id,
        registrado_por_correo: usuarioActual.email ?? null,
      });

    if (perfilNuevoError) {
      // 15. Si el perfil falla, eliminamos también la cuenta Auth.
      // Así evitamos dejar una cuenta incompleta.
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return new Response(
        JSON.stringify({ error: perfilNuevoError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 16. Devolvemos solamente datos seguros.
    // Nunca regresamos ni almacenamos la contraseña.
    return new Response(
      JSON.stringify({
        usuario: {
          id: authData.user.id,
          empleadoId: empleado.id,
          nombreCompleto: empleado.nombre,
          correo: correoNormalizado,
          rol,
        },
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log("Error inesperado al crear usuario:", error);

    return new Response(
      JSON.stringify({ error: "Ocurrió un error inesperado al crear el usuario." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
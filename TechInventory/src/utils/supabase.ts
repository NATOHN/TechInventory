// Permite que Supabase funcione correctamente con URLs en React Native.
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Obtenemos las credenciales públicas definidas en el archivo .env.
// Estas variables pueden utilizarse en Expo porque comienzan con EXPO_PUBLIC_.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

// Validamos la configuración para detectar inmediatamente si falta alguna variable.
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Faltan las variables de entorno necesarias para conectar con Supabase.");
}

// Creamos una única instancia para reutilizarla en toda la aplicación.
export const supabase = createClient(supabaseUrl, supabaseKey,{
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
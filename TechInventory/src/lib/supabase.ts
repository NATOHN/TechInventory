// Permite que Supabase funcione correctamente con URLs en React Native.
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Credenciales públicas de nuestro proyecto Supabase.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Creamos una sola instancia del cliente para reutilizarla en toda la aplicación.
export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey,
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);
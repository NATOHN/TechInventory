// 1. Importaciones
import { createContext, useState, useContext, ReactNode} from 'react';


// 2. Colores que utilizará la aplicación cuando esté en modo claro
export const lightColors = {
    background: '#FFFFFF',
    surface: '#F5F5F5',

    text: '#1A1A1A',
    textSecondary: '#666666',

    primary: '#1E3A8A',

    border: '#E0E0E0',

    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
};


// 3. Colores que utilizará la aplicación cuando esté en modo oscuro
export const darkColors = {
    background: '#121212',
    surface: '#1E1E1E',

    text: '#F5F5F5',
    textSecondary: '#AAAAAA',

    primary: '#90CAF9',

    border: '#333333',

    cardBackground: '#2C2C2C',
    cardBorder: '#444444',
};


// 4. Cree un tipo a partir de la estructura de lightColors.
export type ThemeColors = typeof lightColors;


// 5. Definimos la información que podrá compartir nuestro ThemeContext.
type ThemeContextType = {
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
};

// 6. Contexto del tema.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 7. Creamos el Provider que envolverá los componentes de la aplicación.
// children representa todo lo que coloquemos dentro de <ThemeProvider>...</ThemeProvider>.
export const ThemeProvider = ({ children }: { children: ReactNode }) => {

    // 8. Creamos un estado para saber si el modo oscuro está activo.
    const [isDark, setIsDark] = useState(false);

    // 9. Seleccionamos la paleta de colores según el estado isDark.
    const colors = isDark ? darkColors : lightColors;

    //10. Creamos la función que cambiará entre tema claro y oscuro.
    const toggleTheme = () => {
        setIsDark((previousValue) => !previousValue);
    };

    // 11. Usamos ThemeContext.Provider para compartir la información
    // del tema con todos los componentes que estén dentro del ThemeProvider.
    return (
        <ThemeContext.Provider
            value={{
            isDark,
            colors,
            toggleTheme,
        }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// 12. Creacion del hook personalizado para acceder fácilmente al ThemeContext.
// useContext lee los valores que comparte ThemeContext.Provider.
export const useTheme = () => {
    const context = useContext(ThemeContext);

    // 13. Validamos que useTheme se utilice dentro de ThemeProvider.
    if (!context) {
        throw new Error('useTheme debe utilizarse dentro de ThemeProvider');
    }

    // 14. Retornamos la información del contexto.
    return context;
};

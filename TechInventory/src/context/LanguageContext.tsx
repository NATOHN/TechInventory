//Importaciones
import { I18n } from "i18n-js";
import {createContext, useContext, useEffect, useState, ReactNode,} from "react";
//2. Importamos AsyncStorage para guardar el idioma seleccionado
// y poder recuperarlo aunque la aplicación se cierre.
import AsyncStorage from "@react-native-async-storage/async-storage";
//3.Importamos getLocales para conocer
// el idioma configurado actualmente en el dispositivo.
import { getLocales } from "expo-localization";


import { translations } from "../utils/translations";


// 1. Creamos una instancia de I18n y le entregamos
// nuestro objeto de traducciones en español e inglés.
const i18n = new I18n(translations);

// 18. Creamos una clave fija para identificar
// dónde se guardará el idioma dentro de AsyncStorage.
const LANGUAGE_STORAGE_KEY = "@techinventory_language";

// 4. Definimos los idiomas permitidos dentro de TechInventory.
export type Language = "es" | "en";


// 5. Definimos la información que compartirá LanguageContext.
// language: indica cuál idioma está activo.
// changeLanguage: permitirá cambiar entre español e inglés.
// t: será la función utilizada para obtener un texto traducido.
type LanguageContextType = {
    language: Language;
    changeLanguage: (newLanguage: Language) => Promise<void>;
    t: (key: string) => string;
};

// 6. Creamos el contexto del idioma.
const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);


// 7. Creamos el Provider que envolverá los componentes de la aplicación.
export const LanguageProvider = ({ children }: { children: ReactNode }) => {

    // 8. Creamos el estado que guardará el idioma actual.
    const [language, setLanguage] = useState<Language>("es");

    // 18. Sincronizamos el idioma activo de i18n
    // con el idioma guardado actualmente en el estado.
    i18n.locale = language;


    // 20. Al cargar LanguageProvider verificamos qué idioma
    // debe utilizar inicialmente la aplicación.
    useEffect(() => {

        // 21. Creamos una función asíncrona porque leer
        // información de AsyncStorage requiere esperar una respuesta.
        const loadLanguage = async () => {

            try {

                // 22. Buscamos si el usuario ya había seleccionado
                // anteriormente un idioma dentro de TechInventory.
                const savedLanguage = await AsyncStorage.getItem(
                    LANGUAGE_STORAGE_KEY
                );


                // 23. Si encontramos "es" o "en" guardado,
                // utilizamos ese idioma como primera opción.
                if (savedLanguage === "es" || savedLanguage === "en") {

                    setLanguage(savedLanguage);
                    i18n.locale = savedLanguage;

                    // Detenemos la función porque ya encontramos una preferencia guardada.
                    return;
                }


                // 24. Si no existe un idioma guardado
                // consultamos el idioma configurado en el dispositivo.
                const deviceLanguage = getLocales()[0]?.languageCode;


                // 25. Como TechInventory solamente tiene español e inglés,
                // usamos inglés si el dispositivo está en inglés.
                // Para cualquier otro idioma utilizamos español.
                const initialLanguage: Language =
                    deviceLanguage === "en" ? "en" : "es";


                // 26. Actualizamos React e i18n con el idioma inicial.
                setLanguage(initialLanguage);
                i18n.locale = initialLanguage;

            } catch (error) {

                // 27. Si ocurre algún problema al leer AsyncStorage,
                // mantenemos español como idioma seguro por defecto.
                console.log("Error al cargar el idioma:", error);

                setLanguage("es");
                i18n.locale = "es";
            }
        };


    // 20. Ejecutamos la función cuando se carga LanguageProvider.
    loadLanguage();

}, []);




    // 9. Creamos la función encargada de cambiar el idioma.
    // Recibe el nuevo idioma seleccionado: "es" o "en".
    const changeLanguage = async (newLanguage: Language) => {

        // 10. Actualizamos el estado del idioma dentro de React.
        setLanguage(newLanguage);

        // 11. También indicamos a i18n cuál idioma debe utilizar
        // para devolver las traducciones correctas.
        i18n.locale = newLanguage;

        // 19. Guardamos el idioma seleccionado en AsyncStorage.
        await AsyncStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            newLanguage
        );
    };

    // 12. Creamos una función sencilla para obtener traducciones.
    // Recibe una clave, por ejemplo "profile",
    // y devuelve el texto correspondiente al idioma actual.
    const t = (key: string) => {
        return i18n.t(key);
    };

    // 13. Usamos LanguageContext.Provider para compartir
    // el idioma actual y las funciones de traducción
    // con todos los componentes hijos.
    return (
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

// 14. Creamos un hook personalizado para acceder fácilmente
// a la información compartida por LanguageContext.
export const useLanguage = () => {

    // 15. Leemos el contexto actual del idioma.
    const context = useContext(LanguageContext);

    // 16. Validamos que useLanguage se utilice dentro
    // de LanguageProvider.
    if (!context) {
        throw new Error(
            "useLanguage debe utilizarse dentro de LanguageProvider"
        );
    }

    // 17. Retornamos el contexto completo.
    // Esto permitirá acceder a language, changeLanguage y t.
    return context;
};
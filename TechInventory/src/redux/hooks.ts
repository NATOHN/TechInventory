
//1. Importaciones
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';


// 2. Importamos los tipos que creamos dentro del Store, RootState representa todo el estado global.
// AppDispatch representa el tipo de dispatch de nuestra aplicación.
import type {RootState, AppDispatch,} from './store';


// 3. Creamos nuestro propio hook para enviar acciones ahora useAppDispatch conoce automáticamente
// la configuración del Store de TechInventory.
export const useAppDispatch = () => useDispatch<AppDispatch>();


// 4. Creamos nuestro propio hook para leer el Store, RootState permite que TypeScript conozca
// toda la estructura del estado global.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
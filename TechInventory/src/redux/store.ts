//1. Importaciones 
import { configureStore } from '@reduxjs/toolkit';

import equipmentReducer from './equipmentSlice';


// 2. Creamos el Store principal de TechInventory.
export const store = configureStore({
    reducer: {
        // 3. La propiedad equipment representará todo el estado manejado por equipmentSlice.
        equipment: equipmentReducer,
    },
});

// 6. RootState representa la estructura completa del estado global almacenado dentro de Redux.
export type RootState = ReturnType<typeof store.getState>;

// 7. AppDispatch representa el tipo de dispatch configurado dentro de nuestro Store.
export type AppDispatch = typeof store.dispatch;

// 1. Importamos únicamente el tipo ImageSourcePropType.
import type { ImageSourcePropType } from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// 2. Definimos los estados permitidos para un equipo.
export type EquipmentStatus = | 'activo' | 'taller' | 'baja';


// 3. Definimos la estructura que tendrá cada equipo
// almacenado dentro de Redux.
export type Equipment = {
    codigo: string;
    marca: string;
    modelo: string;
    serie: string;
    sucursal: string;
    departamento: string;
    empleadoAsignado: string;
    status: EquipmentStatus;
    foto: ImageSourcePropType;
};


// 4. Definimos la estructura del estado que manejará Redux para el módulo de equipos.
// equipments será el arreglo que contendrá todos los equipos registrados en TechInventory.
type EquipmentState = {
    equipments: Equipment[];
};


// 5. Creamos el estado inicial del módulo de equipos.
// Por ahora comenzamos con un arreglo vacío.
const initialState: EquipmentState = {
    equipments: [
        // 12. Primer equipo de prueba.
        {
            codigo: "EQ-0001",
            marca: "Dell",
            modelo: "Inspiron 3530",
            serie: "ABC123456",
            sucursal: "Tegucigalpa",
            departamento: "Administración",
            empleadoAsignado: "Carlos López",
            status: "activo",
            foto: require("../img/dell.png"),
        },

        // 13. Segundo equipo de prueba.
        {
            codigo: "EQ-0002",
            marca: "HP",
            modelo: "ProDesk 400 G9",
            serie: "N/A",
            sucursal: "San Pedro Sula",
            departamento: "Contabilidad",
            empleadoAsignado: "Sin asignar",
            status: "taller",
            foto: require("../img/hp-prodesk-400-g9.png"),
        },

        // 14. Tercer equipo de prueba.
        {
            codigo: "EQ-0003",
            marca: "Dell",
            modelo: "Inspiron 5555",
            serie: "AB554FG",
            sucursal: "San Pedro Sula",
            departamento: "Vetas",
            empleadoAsignado: "Josue Meza",
            status: "baja",
            foto: require("../img/dell-5555.jpg"),
        },
    ],
};


// 6. Creamos el Slice encargado de manejar
// toda la información relacionada con los equipos.
const equipmentSlice = createSlice({

    // 7. Nombre interno del Slice dentro de Redux.
    name: 'equipment',

    // 8. Indicamos cuál será el estado inicial que utilizará este módulo.
    initialState,

    // 9. Aquí agregaremos las funciones que modificarán el estado de los equipos.
    reducers: {
        agregarEquipo: (state, action: PayloadAction<Equipment>) => {
            // 10. action.payload contiene el equipo que fue enviado desde la aplicación.
            state.equipments.push(action.payload);
        },

        cargarEquipos: (state,  action: PayloadAction<Equipment[]>) => {
            //11. Sustituimos los equipos actuales por los recuperados desde AsyncStorage.
            state.equipments = action.payload;
        },
    },
});

export const { agregarEquipo, cargarEquipos } = equipmentSlice.actions;
export default equipmentSlice.reducer;
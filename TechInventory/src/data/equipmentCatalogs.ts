
// 1. Define la estructura que tendrá cada marca disponible.
export type BrandOption = {
    id: string;
    name: string;
};


// 2. Define la estructura de cada departamento.
export type DepartmentOption = {
    id: string;
    name: string;
};


// 3. Define cada sucursal junto con los departamentos
// que pertenecen específicamente a esa ubicación.
export type BranchOption = {
    id: string;
    name: string;
    departments: DepartmentOption[];
};


// 4. Catálogo temporal de marcas.
// Más adelante estos datos serán obtenidos desde Supabase.
export const BRAND_OPTIONS: BrandOption[] = [
    { id: "dell", name: "Dell" },
    { id: "hp", name: "HP" },
];


// 5. Catálogo temporal de sucursales y departamentos.
// Cada departamento pertenece únicamente a su sucursal.
export const BRANCH_OPTIONS: BranchOption[] = [
    {
        id: "tegucigalpa",
        name: "Tegucigalpa",
        departments: [
            { id: "administracion-tgu", name: "Administración" },
        ],
    },
    {
        id: "san-pedro-sula",
        name: "San Pedro Sula",
        departments: [
            { id: "contabilidad-sps", name: "Contabilidad" },
            { id: "ventas-sps", name: "Ventas" },
        ],
    },
];

// 6. Define la estructura de cada empleado disponible.
// Cada empleado pertenece a una sucursal y departamento específicos.
export type EmployeeOption = {
    id: string;
    name: string;
    branchId: string;
    departmentId: string;
};

// 7. Catálogo temporal de empleados.
// Más adelante esta información será obtenida desde Supabase.
export const EMPLOYEE_OPTIONS: EmployeeOption[] = [
    {
        id: "emp-001",
        name: "Carlos López",
        branchId: "tegucigalpa",
        departmentId: "administracion-tgu",
    },
    {
        id: "emp-002",
        name: "Josue Meza",
        branchId: "san-pedro-sula",
        departmentId: "ventas-sps",
    },
    {
        id: "emp-003",
        name: "Maria Meza",
        branchId: "san-pedro-sula",
        departmentId: "contabilidad-sps",
    },
];
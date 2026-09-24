// 1. Define la estructura que tendrá cada marca disponible.
export type BrandOption = {
    id: string;
    name: string;
};

// 2. Catálogo temporal de marcas.
// Más adelante también podrá migrarse a Supabase si necesitamos administrarlas dinámicamente.
export const BRAND_OPTIONS: BrandOption[] = [
    { id: "dell", name: "Dell" },
    { id: "hp", name: "HP" },
];
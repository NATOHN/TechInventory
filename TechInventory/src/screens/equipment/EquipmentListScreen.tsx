import { Text, ScrollView, StyleSheet, TextInput, View, TouchableOpacity, Modal } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";


import EquipmentCard from "../../components/EquipmentCard";
import { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppSelector } from "../../redux/hooks";


type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentList"
>;


// Definimos los únicos filtros de estado que puede seleccionar el usuario.
type StatusFilter = | 'todos' | 'activo' | 'taller' | 'baja';

const EquipmentListScreen = ({ navigation }: Props) => {
    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();
    //Obtenemos la función t desde LanguageContext
    const { t } = useLanguage();

    // Creamos un estado para almacenar lo que el usuario escriba en el buscador.
    const [searchText, setSearchText] = useState("");

    // Guardamos el filtro de estado seleccionado al iniciar mostramos todos los equipos.
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');

    // Controla si el modal de filtros avanzados está abierto o cerrado.
    const [showFilters, setShowFilters] = useState(false);

    const [selectedBranch, setSelectedBranch] = useState("todas");

    // Guarda el departamento seleccionado en los filtros avanzados.
    const [selectedDepartment, setSelectedDepartment] = useState("todos");

    // Guarda la marca seleccionada en los filtros avanzados.
    const [selectedBrand, setSelectedBrand] = useState("todas");

    // Obtenemos el arreglo de equipos almacenado en Redux, state representa todo el Store.
    // equipment es nuestro Slice, equipments es el arreglo definido dentro del estado.
    const equipos = useAppSelector((state) => state.equipment.equipments);

    const sucursales = [...new Set(equipos.map((equipo) => equipo.sucursal))];

    // Obtenemos los departamentos disponibles.
    // Si hay una sucursal seleccionada, mostramos solo los departamentos de esa sucursal.
    const departamentos = [...new Set(
        equipos
            .filter((equipo) => selectedBranch === "todas" || equipo.sucursal === selectedBranch)
            .map((equipo) => equipo.departamento)
    )];

    // Obtenemos las marcas disponibles según la sucursal y el departamento seleccionados actualmente.
    const marcas = [...new Set(
        equipos
            .filter((equipo) => selectedBranch === "todas" || equipo.sucursal === selectedBranch)
            .filter((equipo) => selectedDepartment === "todos" || equipo.departamento === selectedDepartment)
            .map((equipo) => equipo.marca)
    )];

    // Creamos una versión del texto de búsqueda sin espacios al inicio/final y en minúsculas.
    const textoBusqueda = searchText.trim().toLowerCase();

    // Filtramos primero por el texto escrito en el buscador esta lista nos servirá para calcular las cantidades
    // que se mostrarán dentro de cada filtro.
    const equiposSegunBusqueda = equipos.filter((equipo) => {
        //Convertimos los campos a minúsculas para que la búsqueda no distinga entre mayúsculas y minúsculas.
        const codigo = equipo.codigo.toLowerCase();
        const marca = equipo.marca.toLowerCase();
        const modelo = equipo.modelo.toLowerCase();
        const serie = equipo.serie.toLowerCase();
        const sucursal = equipo.sucursal.toLowerCase();
        const departamento = equipo.departamento.toLowerCase();
        const empleado = equipo.empleadoAsignado.toLowerCase();

        return (
            codigo.includes(textoBusqueda) ||
            marca.includes(textoBusqueda) ||
            modelo.includes(textoBusqueda) ||
            serie.includes(textoBusqueda) ||
            sucursal.includes(textoBusqueda) ||
            departamento.includes(textoBusqueda) ||
            empleado.includes(textoBusqueda)
        );
    });

    // Calculamos cuántos equipos hay en cada estado tomando como base el resultado de la búsqueda.
    const totalTodos = equiposSegunBusqueda.length;

    const totalActivos = equiposSegunBusqueda.filter((equipo) => equipo.status === 'activo').length;

    const totalTaller = equiposSegunBusqueda.filter((equipo) => equipo.status === 'taller').length;

    const totalBaja = equiposSegunBusqueda.filter((equipo) => equipo.status === 'baja').length;


    // Aplicamos el filtro de estado y también el filtro avanzado de sucursal.
    const equiposFiltrados = equiposSegunBusqueda.filter((equipo) => {
        //Verificamos si el equipo coincide con el estado seleccionado.
        const coincideEstado = statusFilter === 'todos' || equipo.status === statusFilter;

        // Verificamos si el equipo pertenece a la sucursal seleccionada.
        const coincideSucursal = selectedBranch === 'todas' || equipo.sucursal === selectedBranch;

        // Verificamos si pertenece al departamento seleccionado.
        const coincideDepartamento = selectedDepartment === 'todos' || equipo.departamento === selectedDepartment;

        const coincideMarca = selectedBrand === 'todas' || equipo.marca === selectedBrand;

        //El equipo se muestra solamente si cumple ambos filtros.
        return coincideEstado && coincideSucursal && coincideDepartamento && coincideMarca;
    });

    // Indica si existe al menos un filtro avanzado activo.
    const hasAdvancedFilters = selectedBranch !== "todas" || selectedDepartment !== "todos" || selectedBrand !== "todas";

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.screen}>
                <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
                    <Text style={[styles.title, { color: colors.primary }]}>{t("equipmentListTitle")}</Text>

                    <View style={styles.searchRow}>
                        {/* Buscador de equipos */}
                        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border, }]}>
                            {/* Icono de búsqueda */}
                            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />

                            {/* Campo donde el usuario escribe */}
                            <TextInput style={[styles.searchInput, { color: colors.text }]}
                                placeholder="Buscar equipos..."
                                placeholderTextColor={colors.textSecondary}
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                        {/* Botón para los filtros avanzados */}
                        <TouchableOpacity
                            style={[styles.advancedFilterButton, { 
                                backgroundColor: hasAdvancedFilters ? colors.primary : colors.surface, 
                                borderColor: hasAdvancedFilters ? colors.primary : colors.border,
                            }]}
                            onPress={() => setShowFilters(true)}
                        >
                            <Ionicons name="filter" size={20} color={hasAdvancedFilters ? colors.background : colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Contenedor de los filtros por estado */}
                    <View style={styles.filtersContainer}>
                        {/* Filtro Todos */}
                        <TouchableOpacity style={[styles.filterChip, {
                            backgroundColor: statusFilter === 'todos' ? colors.primary : colors.surface,
                            borderColor: statusFilter === 'todos' ? colors.primary : colors.border,
                        }]}
                            onPress={() => setStatusFilter('todos')}
                        >
                            <Text style={[styles.filterText, { color: statusFilter === 'todos' ? colors.background : colors.textSecondary, }]}>
                                {`Todos (${totalTodos})`}
                            </Text>
                        </TouchableOpacity>


                        {/* Filtro Activos */}
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor: statusFilter === 'activo' ? colors.primary : colors.surface,
                                    borderColor: statusFilter === 'activo' ? colors.primary : colors.border,
                                }]}
                            onPress={() => setStatusFilter('activo')}
                        >
                            <Text
                                style={[styles.filterText, { color: statusFilter === 'activo' ? colors.background : colors.textSecondary, }]}
                            >
                                {`${t("statusActive")} (${totalActivos})`}
                            </Text>
                        </TouchableOpacity>


                        {/* Filtro Taller */}
                        <TouchableOpacity style={[styles.filterChip,
                        {
                            backgroundColor: statusFilter === 'taller' ? colors.primary : colors.surface,
                            borderColor: statusFilter === 'taller' ? colors.primary : colors.border,
                        }]}
                            onPress={() => setStatusFilter('taller')}
                        >
                            <Text style={[styles.filterText, { color: statusFilter === 'taller' ? colors.background : colors.textSecondary, }]}>
                                {`${t("statusWorkshop")} (${totalTaller})`}
                            </Text>
                        </TouchableOpacity>


                        {/* Filtro Baja */}
                        <TouchableOpacity style={[styles.filterChip,
                        {
                            backgroundColor: statusFilter === 'baja' ? colors.primary : colors.surface,
                            borderColor: statusFilter === 'baja' ? colors.primary : colors.border,
                        }]}
                            onPress={() => setStatusFilter('baja')}
                        >
                            <Text style={[styles.filterText, { color: statusFilter === 'baja' ? colors.background : colors.textSecondary, }]}>
                                {`${t("statusInactive")} (${totalBaja})`}
                            </Text>
                        </TouchableOpacity>

                    </View>


                    {equiposFiltrados.map((equipo) => {
                        return (
                            <EquipmentCard
                                key={equipo.codigo}
                                codigo={equipo.codigo}
                                marca={equipo.marca}
                                modelo={equipo.modelo}
                                serie={equipo.serie}
                                sucursal={equipo.sucursal}
                                departamento={equipo.departamento}
                                empleadoAsignado={equipo.empleadoAsignado}
                                status={equipo.status}
                                foto={equipo.foto}

                                onPress={() => navigation.navigate("EquipmentDetail", {
                                    codigo: equipo.codigo,
                                    marca: equipo.marca,
                                    modelo: equipo.modelo,
                                    serie: equipo.serie,
                                    sucursal: equipo.sucursal,
                                    departamento: equipo.departamento,
                                    empleadoAsignado: equipo.empleadoAsignado,
                                    status: equipo.status,
                                    foto: equipo.foto,
                                })}
                            />
                        )
                    })}
                </ScrollView>

                {/* Pie fijo con el botón principal */}
                <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, }]}>
                    <TouchableOpacity
                        style={[styles.bottomRegisterButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate("RegisterEquipment")}
                    >
                        <Ionicons name="add" size={22} color={colors.background} />
                        <Text style={[styles.bottomRegisterButtonText, { color: colors.background }]}>
                            {t("registerEquipmentButton")}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Modal de filtros avanzados */}
                <Modal visible={showFilters} transparent animationType="slide" onRequestClose={() => setShowFilters(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Filtros avanzados</Text>
                                <TouchableOpacity onPress={() => setShowFilters(false)}>
                                    <Ionicons name="close" size={26} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                                Filtra los equipos por sucursal, departamento o marca.
                            </Text>

                            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Sucursal</Text>
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.optionChip,
                                        {
                                            backgroundColor: selectedBranch === "todas" ? colors.primary : colors.surface,
                                            borderColor: selectedBranch === "todas" ? colors.primary : colors.border
                                        }
                                    ]}
                                    onPress={() => setSelectedBranch("todas")}
                                >
                                    <Text style={{ color: selectedBranch === "todas" ? colors.background : colors.textSecondary }}>
                                        Todas
                                    </Text>
                                </TouchableOpacity>

                                {sucursales.map((sucursal) => (
                                    <TouchableOpacity
                                        key={sucursal}
                                        style={[
                                            styles.optionChip,
                                            {
                                                backgroundColor: selectedBranch === sucursal ? colors.primary : colors.surface,
                                                borderColor: selectedBranch === sucursal ? colors.primary : colors.border
                                            }
                                        ]}
                                        onPress={() => setSelectedBranch(sucursal)}
                                    >
                                        <Text style={{ color: selectedBranch === sucursal ? colors.background : colors.textSecondary }}>
                                            {sucursal}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Filtro avanzado por departamento. */}
                            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Departamento</Text>

                            <View style={styles.optionsContainer}>
                                {/* Opción para no aplicar ningún filtro de departamento. */}
                                <TouchableOpacity
                                    style={[styles.optionChip, {
                                        backgroundColor: selectedDepartment === "todos" ? colors.primary : colors.surface,
                                        borderColor: selectedDepartment === "todos" ? colors.primary : colors.border
                                    }]}
                                    onPress={() => setSelectedDepartment("todos")}
                                >
                                    <Text style={{ color: selectedDepartment === "todos" ? colors.background : colors.textSecondary }}>Todos</Text>
                                </TouchableOpacity>

                                {/* Creamos una opción por cada departamento disponible. */}
                                {departamentos.map((departamento) => (
                                    <TouchableOpacity
                                        key={departamento}
                                        style={[styles.optionChip, {
                                            backgroundColor: selectedDepartment === departamento ? colors.primary : colors.surface,
                                            borderColor: selectedDepartment === departamento ? colors.primary : colors.border
                                        }]}
                                        onPress={() => setSelectedDepartment(departamento)}
                                    >
                                        <Text style={{ color: selectedDepartment === departamento ? colors.background : colors.textSecondary }}>
                                            {departamento}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Filtro avanzado por marca. */}
                            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Marca</Text>

                            <View style={styles.optionsContainer}>
                                {/* Permite mostrar equipos de cualquier marca. */}
                                <TouchableOpacity
                                    style={[styles.optionChip, {
                                        backgroundColor: selectedBrand === "todas" ? colors.primary : colors.surface,
                                        borderColor: selectedBrand === "todas" ? colors.primary : colors.border
                                    }]}
                                    onPress={() => setSelectedBrand("todas")}
                                >
                                    <Text style={{ color: selectedBrand === "todas" ? colors.background : colors.textSecondary }}>Todas</Text>
                                </TouchableOpacity>

                                {/* Creamos una opción por cada marca disponible. */}
                                {marcas.map((marca) => (
                                    <TouchableOpacity
                                        key={marca}
                                        style={[styles.optionChip, {
                                            backgroundColor: selectedBrand === marca ? colors.primary : colors.surface,
                                            borderColor: selectedBrand === marca ? colors.primary : colors.border
                                        }]}
                                        onPress={() => setSelectedBrand(marca)}
                                    >
                                        <Text style={{ color: selectedBrand === marca ? colors.background : colors.textSecondary }}>{marca}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Botón para restablecer todos los filtros avanzados. */}
                            <TouchableOpacity
                                style={[styles.clearFiltersButton, { borderColor: colors.border }]}
                                onPress={() => {
                                    setSelectedBranch("todas");
                                    setSelectedDepartment("todos");
                                    setSelectedBrand("todas");
                                }}
                            >
                                <Ionicons name="refresh-outline" size={18} color={colors.primary} />
                                <Text style={[styles.clearFiltersText, { color: colors.primary }]}>Limpiar filtros</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>


            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    container: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 24,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 16,
    },

    // Contenedor visual del buscador.
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
    },

    // Campo de texto del buscador.
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 12,
        marginLeft: 8,
    },

    // Contenedor horizontal de los filtros.
    filtersContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 6,
        marginBottom: 16,
    },

    // Diseño de cada filtro.
    filterChip: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        paddingVertical: 9,
        borderRadius: 20,
        borderWidth: 1,
    },

    // Texto de los filtros.
    filterText: {
        fontSize: 13,
        fontWeight: '600',
    },


    // Contenedor general de la pantalla.
    // Permite que el ScrollView ocupe el espacio
    // y que el footer quede fijo abajo.
    screen: {
        flex: 1,
    },

    // Pie inferior fijo de la pantalla.
    footer: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 8,
        borderTopWidth: 1,
    },

    // Botón principal grande ubicado abajo.
    bottomRegisterButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
    },

    // Texto del botón inferior.
    bottomRegisterButtonText: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },

    // Mantiene el buscador y el botón
    // de filtros en una misma línea.
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },

    // Botón cuadrado para abrir
    // los filtros avanzados.
    advancedFilterButton: {
        width: 48,
        height: 48,
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        padding: 20,
        paddingBottom: 30,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        minHeight: 280,
    },

    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },

    modalDescription: {
        fontSize: 14,
    },

    filterSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 10,
    },

    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    optionChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },

    // Botón secundario para limpiar los filtros avanzados.
    clearFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        marginTop: 18,
    },

    // Texto del botón para limpiar filtros.
    clearFiltersText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },

})

export default EquipmentListScreen;
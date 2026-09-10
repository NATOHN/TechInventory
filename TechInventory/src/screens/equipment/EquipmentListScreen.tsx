import { Text, ScrollView, StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
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

    // Obtenemos el arreglo de equipos almacenado en Redux, state representa todo el Store.
    // equipment es nuestro Slice, equipments es el arreglo definido dentro del estado.
    const equipos = useAppSelector(
        (state) => state.equipment.equipments
    );

    // Creamos una versión del texto de búsqueda sin espacios al inicio/final y en minúsculas.
    const textoBusqueda = searchText.trim().toLowerCase();

    // Filtramos primero por el texto escrito en el buscador esta lista nos servirá para calcular las cantidades
    // que se mostrarán dentro de cada filtro.
    const equiposSegunBusqueda = equipos.filter((equipo) => {
        const codigo = equipo.codigo.toLowerCase();
        const modelo = equipo.modelo.toLowerCase();
        const serie = equipo.serie.toLowerCase();

        return (
            codigo.includes(textoBusqueda) ||
            modelo.includes(textoBusqueda) ||
            serie.includes(textoBusqueda)
        );
    });

    // Calculamos cuántos equipos hay en cada estado tomando como base el resultado de la búsqueda.
    const totalTodos = equiposSegunBusqueda.length;

    const totalActivos = equiposSegunBusqueda.filter(
        (equipo) => equipo.status === 'activo'
    ).length;

    const totalTaller = equiposSegunBusqueda.filter(
        (equipo) => equipo.status === 'taller'
    ).length;

    const totalBaja = equiposSegunBusqueda.filter(
        (equipo) => equipo.status === 'baja'
    ).length;


    // Filtramos los equipos utilizando el texto escrito por el usuario.
    const equiposFiltrados = equiposSegunBusqueda.filter((equipo) => {
        const coincideEstado =
            statusFilter === 'todos' ||
            equipo.status === statusFilter;

        return coincideEstado;
    });

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.screen}>
                <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
                    <Text style={[styles.title, { color: colors.primary }]}>{t("equipmentListTitle")}</Text>

                    {/* Buscador de equipos */}
                    <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border, }]}>
                        {/* Icono de búsqueda */}
                        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />

                        {/* Campo donde el usuario escribe */}
                        <TextInput style={[styles.searchInput, { color: colors.text }]}
                            placeholder="Buscar por código, modelo o serie"
                            placeholderTextColor={colors.textSecondary}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>

                    {/* Contenedor de los filtros por estado */}
                    <View style={styles.filtersContainer}>
                        {/* Filtro Todos */}
                        <TouchableOpacity style={[styles.filterChip, {
                            backgroundColor:
                                statusFilter === 'todos'
                                    ? colors.primary
                                    : colors.surface,

                            borderColor:
                                statusFilter === 'todos'
                                    ? colors.primary
                                    : colors.border,
                        }
                        ]}
                            onPress={() => setStatusFilter('todos')}
                        >
                            <Text style={[styles.filterText, {
                                color:
                                    statusFilter === 'todos'
                                        ? colors.background
                                        : colors.textSecondary,
                            }
                            ]}
                            >
                                {`Todos (${totalTodos})`}
                            </Text>
                        </TouchableOpacity>


                        {/* Filtro Activos */}
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor:
                                        statusFilter === 'activo'
                                            ? colors.primary
                                            : colors.surface,

                                    borderColor:
                                        statusFilter === 'activo'
                                            ? colors.primary
                                            : colors.border,
                                }
                            ]}
                            onPress={() => setStatusFilter('activo')}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    {
                                        color:
                                            statusFilter === 'activo'
                                                ? colors.background
                                                : colors.textSecondary,
                                    }
                                ]}
                            >
                                {`${t("statusActive")} (${totalActivos})`}
                            </Text>
                        </TouchableOpacity>


                        {/* Filtro Taller */}
                        <TouchableOpacity style={[styles.filterChip,
                        {
                            backgroundColor:
                                statusFilter === 'taller'
                                    ? colors.primary
                                    : colors.surface,

                            borderColor:
                                statusFilter === 'taller'
                                    ? colors.primary
                                    : colors.border,
                        }
                        ]}
                            onPress={() => setStatusFilter('taller')}
                        >
                            <Text style={[styles.filterText,
                            {
                                color:
                                    statusFilter === 'taller'
                                        ? colors.background
                                        : colors.textSecondary,
                            }
                            ]}
                            >
                                {`${t("statusWorkshop")} (${totalTaller})`}
                            </Text>
                        </TouchableOpacity>


                        {/* Filtro Baja */}
                        <TouchableOpacity style={[styles.filterChip,
                        {
                            backgroundColor:
                                statusFilter === 'baja'
                                    ? colors.primary
                                    : colors.surface,

                            borderColor:
                                statusFilter === 'baja'
                                    ? colors.primary
                                    : colors.border,
                        }
                        ]}
                            onPress={() => setStatusFilter('baja')}
                        >
                            <Text style={[styles.filterText,{color:statusFilter === 'baja' ? colors.background: colors.textSecondary,}]}>
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
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 14,
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

})

export default EquipmentListScreen;
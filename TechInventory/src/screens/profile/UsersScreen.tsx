// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../redux/hooks';
import { AppUser } from '../../redux/usersSlice';

// 2. Definimos los filtros disponibles para la lista de usuarios.
type FilterType = 'todos' | 'tecnico' | 'administrador';

export default function UsersScreen({ navigation }: any) {
  // 3. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 4. Estado local que controla que filtro esta activo actualmente.
  const [filter, setFilter] = useState<FilterType>('todos');

  // 5. Leemos el arreglo completo de usuarios desde Redux.
  const users = useAppSelector((state) => state.users.users);

  // 6. Filtramos los usuarios segun el rol seleccionado.
  const usuariosFiltrados = users.filter((u: AppUser) => {
    if (filter === 'todos') return true;
    return u.rol === filter;
  });

  // 7. Definimos las pestañas visibles con su respectivo conteo.
  const tabs: { key: FilterType; label: string }[] = [
    { key: 'todos', label: `Todos (${users.length})` },
    { key: 'tecnico', label: `Técnicos (${users.filter((u) => u.rol === 'tecnico').length})` },
    { key: 'administrador', label: `Admins (${users.filter((u) => u.rol === 'administrador').length})` },
  ];

  // 8. Muestra los datos basicos de un usuario. La edicion se agregara en una futura iteracion.
  const verDetalleUsuario = (usuario: AppUser) => {
    Alert.alert(
      usuario.nombreCompleto,
      `Correo: ${usuario.correo}\nRol: ${usuario.rol === 'administrador' ? 'Administrador' : 'Técnico'}`
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.screen}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>

          {/* 9. Encabezado con boton de regreso y titulo */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.primary }]}>Usuarios y técnicos</Text>
          </View>

          {/* 10. Fila de pestañas para filtrar por rol */}
          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const isActive = filter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    { backgroundColor: isActive ? colors.primary : colors.surface, borderColor: colors.border },
                  ]}
                  onPress={() => setFilter(tab.key)}
                >
                  <Text style={[styles.tabText, { color: isActive ? 'white' : colors.text }]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 11. Lista de usuarios filtrados */}
          <FlatList
            data={usuariosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => verDetalleUsuario(item)}
              >
                <View style={[styles.avatar, { backgroundColor: colors.background }]}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardNombre, { color: colors.text }]}>{item.nombreCompleto}</Text>
                  <Text style={[styles.cardCorreo, { color: colors.textSecondary }]}>{item.correo}</Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: item.rol === 'administrador' ? '#1E3A8A' : '#059669' },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.rol === 'administrador' ? 'ADMIN' : 'TÉCNICO'}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        </View>

        {/* 12. Pie fijo con el boton para registrar un usuario nuevo */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.bottomRegisterButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('NewUserScreen')}
          >
            <Ionicons name="add" size={22} color={colors.background} />
            <Text style={[styles.bottomRegisterButtonText, { color: colors.background }]}>Registrar usuario</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  tabText: { fontSize: 12, fontWeight: '600' },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardNombre: { fontSize: 14, fontWeight: '700' },
  cardCorreo: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, borderTopWidth: 1 },
  bottomRegisterButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  bottomRegisterButtonText: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
});
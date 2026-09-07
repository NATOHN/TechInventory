import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';


export default function HomeTab() {
  //Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Ionicons name='hardware-chip' size={64} color={colors.primary} />
      <Text style={[styles.title, {color: colors.primary}]}>Bienvenido a TechInventory</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>Control de inventario, ubicacion y mantenimiento de equipos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 16, color: '#1E3A8A', textAlign: 'center' },
  desc: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
});
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Ionicons name='hardware-chip' size={64} color='#1E3A8A' />
      <Text style={styles.title}>Bienvenido a TechInventory</Text>
      <Text style={styles.desc}>Control de inventario, ubicacion y mantenimiento de equipos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 16, color: '#1E3A8A', textAlign: 'center' },
  desc: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
});
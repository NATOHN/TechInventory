import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { navigationRef } from '../../navigation/NavigationService';

export default function ProfileTab() {
  const handleLogout = () => {
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name='person-circle' size={100} color='#1E3A8A' />
      <Text style={styles.name}>Mi Perfil</Text>
      <Text style={styles.role}>Tecnico de mantenimiento</Text>
      <CustomButton title='Cerrar sesion' onPress={handleLogout} variant='danger' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 12, color: '#1E3A8A' },
  role: { fontSize: 14, color: '#666', marginBottom: 32 },
});
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { navigationRef } from '../../navigation/NavigationService';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileTab() {
  // Obtenemos del ThemeContext:
  const { isDark, colors, toggleTheme } = useTheme();
  const handleLogout = () => {
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background} ]}>
      <Ionicons name='person-circle' size={100} color= {colors.primary} />
      <Text style={[styles.name, {color: colors.text}]}>Mi Perfil</Text>
      <Text style={[styles.role, {color: colors.textSecondary}]}>Tecnico de mantenimiento</Text>
      {/*<CustomButton title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'} onPress={toggleTheme} variant='secondary'/>*/}
      <View style={[styles.themeRow,]}>
          {/* 8. Texto descriptivo del switch */}
            <Text style={[styles.themeText, { color: colors.text }]}>
                Modo oscuro
            </Text>

            {/* 9. Switch nativo para activar o desactivar el tema */}
            <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#D1D5DB', true: colors.primary }}
                thumbColor={'#FFFFFF'}
            />
      </View>
      <CustomButton title='Cerrar sesion' onPress={handleLogout} variant='danger' />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    name: { fontSize: 24, fontWeight: 'bold', marginTop: 12, color: '#1E3A8A' },
    role: { fontSize: 14, color: '#666', marginBottom: 32 },

    themeRow: {
      width: '75%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },


    themeText: {
        fontSize: 16,
        fontWeight: '500',
    },



});
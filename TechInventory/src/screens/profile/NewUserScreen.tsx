// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { crearUsuario, UserRole } from '../../redux/usersSlice';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function NewUserScreen({ navigation }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 3. Obtenemos dispatch para poder enviar acciones a Redux.
  const dispatch = useAppDispatch();

  // 4. Estados locales del formulario.
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState<UserRole>('tecnico');

  // 5. Valida los campos antes de guardar: nombre no vacio y correo con formato basico (@).
  const validarCampos = () => {
    if (!nombreCompleto.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre completo del usuario.');
      return false;
    }
    if (!correo.trim().includes('@')) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return false;
    }
    return true;
  };

  // 6. Crea el usuario en Redux y regresa a la lista.
  const handleGuardar = () => {
    if (!validarCampos()) return;

    dispatch(
      crearUsuario({
        id: `USR-${Date.now()}`,
        nombreCompleto: nombreCompleto.trim(),
        correo: correo.trim().toLowerCase(),
        rol,
        fechaCreacion: new Date().toISOString(),
      })
    );

    navigation.navigate('UsersScreen');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 7. Encabezado con boton de regreso y titulo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.primary }]}>Registrar usuario</Text>
        </View>

        {/* 8. Campo: nombre completo del empleado */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Nombre del empleado</Text>
        <CustomInput type="text" placeholder="Ej. Carlos Méndez" value={nombreCompleto} onChange={setNombreCompleto} />

        {/* 9. Campo: correo electronico */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Correo electrónico</Text>
        <CustomInput type="text" placeholder="correo@empresa.com" value={correo} onChange={setCorreo} />

        {/* 10. Seccion: tipo de usuario, mediante toggle */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Tipo de usuario</Text>
        <View style={styles.toggleRow}>
          {(['tecnico', 'administrador'] as UserRole[]).map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.toggleOption,
                { backgroundColor: rol === op ? colors.primary : colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setRol(op)}
            >
              <Text style={{ color: rol === op ? 'white' : colors.text, fontWeight: '600' }}>
                {op === 'tecnico' ? 'Técnico' : 'Administrador'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomButton title="Guardar" onPress={handleGuardar} />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleOption: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
});
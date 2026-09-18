// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { actualizarPerfilPropio } from '../../redux/usersSlice';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function EditProfileScreen({ navigation }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 3. Obtenemos dispatch para poder enviar acciones a Redux.
  const dispatch = useAppDispatch();

  // 4. Buscamos al usuario que representa la sesion actual dentro de Redux.
  const currentUser = useAppSelector((state) =>
    state.users.users.find((u) => u.id === state.users.currentUserId)
  );

  // 5. Estados locales del formulario, precargados con los datos actuales del usuario.
  const [nombreCompleto, setNombreCompleto] = useState(currentUser?.nombreCompleto ?? '');
  const [correo, setCorreo] = useState(currentUser?.correo ?? '');
  const [fotoPerfil, setFotoPerfil] = useState(currentUser?.fotoPerfil);

  // 6. Estados locales solo para el cambio de contraseña (aun sin backend real).
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  // 7. Abre la galeria para seleccionar una nueva foto de perfil.
  const handleSeleccionarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para elegir una foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoPerfil(resultado.assets[0].uri);
    }
  };

  // 8. Guarda los datos basicos del perfil (nombre, correo, foto).
  const handleGuardarPerfil = () => {
    if (!currentUser) return;

    if (!nombreCompleto.trim()) {
      Alert.alert('Campo requerido', 'Ingresa tu nombre completo.');
      return;
    }
    if (!correo.trim().includes('@')) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return;
    }

    dispatch(
      actualizarPerfilPropio({
        id: currentUser.id,
        nombreCompleto: nombreCompleto.trim(),
        correo: correo.trim().toLowerCase(),
        fotoPerfil,
      })
    );

    Alert.alert('Listo', 'Tu perfil se actualizó correctamente.');
  };

  // 9. Valida y "guarda" la contraseña nueva. Sin backend de autenticacion todavia,
  // esto es solo la interfaz lista para cuando se conecte Supabase Auth.
  const handleCambiarPassword = () => {
    if (!nuevaPassword || nuevaPassword.length < 6) {
      Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      Alert.alert('No coinciden', 'La confirmación no coincide con la nueva contraseña.');
      return;
    }

    Alert.alert(
      'Próximamente',
      'El cambio de contraseña se activará cuando se conecte la autenticación con Supabase.'
    );
    setNuevaPassword('');
    setConfirmarPassword('');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 10. Encabezado con boton de regreso y titulo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.primary }]}>Mi Perfil</Text>
        </View>

        {/* 11. Foto de perfil, tocable para cambiarla */}
        <TouchableOpacity style={styles.avatarWrapper} onPress={handleSeleccionarFoto}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-circle" size={100} color={colors.primary} />
          )}
          <View style={[styles.avatarEditBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>Toca la foto para cambiarla</Text>

        {/* 12. Datos de solo lectura: rol actual y fecha de alta, para contexto */}
        {currentUser && (
          <View style={[styles.readonlyRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.readonlyItem}>
              <Text style={[styles.readonlyLabel, { color: colors.textSecondary }]}>Rol</Text>
              <Text style={[styles.readonlyValue, { color: colors.text }]}>
                {currentUser.rol === 'administrador' ? 'Administrador' : 'Técnico'}
              </Text>
            </View>
            <View style={styles.readonlyItem}>
              <Text style={[styles.readonlyLabel, { color: colors.textSecondary }]}>Miembro desde</Text>
              <Text style={[styles.readonlyValue, { color: colors.text }]}>
                {new Date(currentUser.fechaCreacion).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        {/* 13. Datos editables: nombre y correo */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Nombre completo</Text>
        <CustomInput type="text" placeholder="Tu nombre" value={nombreCompleto} onChange={setNombreCompleto} />

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Correo electrónico</Text>
        <CustomInput type="text" placeholder="correo@empresa.com" value={correo} onChange={setCorreo} />

        <CustomButton title="Guardar cambios" onPress={handleGuardarPerfil} />

        {/* 14. Seccion: cambiar contraseña */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cambiar contraseña</Text>

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Nueva contraseña</Text>
        <CustomInput
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={nuevaPassword}
          onChange={setNuevaPassword}
        />

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Confirmar contraseña</Text>
        <CustomInput
          type="password"
          placeholder="Repite la contraseña"
          value={confirmarPassword}
          onChange={setConfirmarPassword}
        />

        <CustomButton title="Cambiar contraseña" onPress={handleCambiarPassword} variant="secondary" />

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
  avatarWrapper: { alignSelf: 'center', marginBottom: 6 },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarHint: { fontSize: 12, textAlign: 'center', marginBottom: 20 },
  readonlyRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  readonlyItem: { flex: 1 },
  readonlyLabel: { fontSize: 11, marginBottom: 2 },
  readonlyValue: { fontSize: 14, fontWeight: '700' },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 28, marginBottom: 4 },
});
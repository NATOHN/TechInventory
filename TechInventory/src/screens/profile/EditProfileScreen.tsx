// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { actualizarPerfilPropioEnSupabase } from '../../redux/usersSlice';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
// Permite convertir la imagen seleccionada en una foto permanente de Supabase Storage.
import { subirFotoPerfilEnStorage } from '../../services/usuariosService';

export default function EditProfileScreen({ navigation }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();
  const { language, t } = useLanguage();

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

  // Conservamos temporalmente los datos necesarios para subir una nueva fotografía.
  const [fotoPerfilBase64, setFotoPerfilBase64] = useState<string | null>(null);
  const [fotoPerfilMimeType, setFotoPerfilMimeType] = useState('image/jpeg');

  // Controla el estado del guardado para evitar múltiples solicitudes.
  const [guardando, setGuardando] = useState(false);



  // 7. Abre la galeria para seleccionar una nueva foto de perfil.
  const handleSeleccionarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(t('editProfilePermissionTitle'), t('editProfilePermissionMessage'));
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,

      // Necesitamos base64 porque Supabase Storage en React Native
      // recibe el archivo mediante ArrayBuffer.
      base64: true,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const asset = resultado.assets[0];

      if (!asset.base64) {
        Alert.alert(
          t('editProfileImageErrorTitle'),
          t('editProfileImageErrorMessage')
        );
        return;
      }

      // La URI local se utiliza inmediatamente para la vista previa.
      setFotoPerfil(asset.uri);

      // Estos datos se utilizarán únicamente cuando el usuario presione Guardar cambios.
      setFotoPerfilBase64(asset.base64);
      setFotoPerfilMimeType(asset.mimeType ?? 'image/jpeg');
    }
  };

  // Guarda el perfil primero en Supabase y después sincroniza Redux.
  const handleGuardarPerfil = async () => {
    if (!currentUser || guardando) return;

    const nombreLimpio = nombreCompleto.trim();

    if (!nombreLimpio) {
      Alert.alert(t('editProfileRequiredTitle'), t('editProfileRequiredMessage'));
      return;
    }

    try {
      setGuardando(true);

      // Si el usuario seleccionó una nueva imagen, primero la subimos a Storage.
      // Si no cambió la fotografía, conservamos la URL que ya tenía.
      let fotoPerfilFinal = currentUser.fotoPerfil;

      if (fotoPerfilBase64) {
        fotoPerfilFinal = await subirFotoPerfilEnStorage(
          currentUser.id,
          fotoPerfilBase64,
          fotoPerfilMimeType
        );
      }

      // Después de obtener la URL permanente actualizamos public.usuarios.
      // Redux recibirá exactamente esa misma URL.
      await dispatch(
        actualizarPerfilPropioEnSupabase({
          usuarioId: currentUser.id,
          nombreCompleto: nombreLimpio,
          fotoPerfil: fotoPerfilFinal,
        })
      ).unwrap();

      // Sustituimos la URI temporal por la URL real de Supabase.
      setFotoPerfil(fotoPerfilFinal);

      // Ya no necesitamos conservar el base64 en memoria.
      setFotoPerfilBase64(null);

      Alert.alert(
        t('editProfileUpdatedTitle'),
        t('editProfileUpdatedMessage')
      );
    } catch (error) {
      console.log('Error al actualizar perfil:', error);

      const mensaje =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : t('editProfileErrorMessage');

      Alert.alert(t('editProfileErrorTitle'), mensaje);
    } finally {
      setGuardando(false);
    }
  };


  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* 10. Encabezado con boton de regreso y titulo */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.primary }]}>{t('editProfileTitle')}</Text>
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
          <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>{t('editProfilePhotoHint')}</Text>

          {/* 12. Datos de solo lectura: rol actual y fecha de alta, para contexto */}
          {currentUser && (
            <View style={[styles.readonlyRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.readonlyItem}>
                <Text style={[styles.readonlyLabel, { color: colors.textSecondary }]}>{t('editProfileRoleLabel')}</Text>
                <Text style={[styles.readonlyValue, { color: colors.text }]}>
                  {currentUser.rol === 'administrador' ? t('administratorRole') : t('technicianShortRole')}
                </Text>
              </View>
              <View style={styles.readonlyItem}>
                <Text style={[styles.readonlyLabel, { color: colors.textSecondary }]}>{t('editProfileMemberSince')}</Text>
                <Text style={[styles.readonlyValue, { color: colors.text }]}>
                  {new Date(currentUser.fechaCreacion).toLocaleDateString(language === 'en' ? 'en-US' : 'es-HN')}
                </Text>
              </View>
            </View>
          )}

          {/* 13. Datos editables: nombre y correo */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('editProfileFullNameLabel')}</Text>
          <CustomInput type="text" placeholder={t('editProfileNamePlaceholder')} value={nombreCompleto} onChange={setNombreCompleto} />

          {/* El correo pertenece a Supabase Auth y por ahora se mantiene como dato de solo lectura. */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            {t('editProfileEmailLabel')}
          </Text>

          <View
            style={[
              styles.readonlyEmail,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={19}
              color={colors.textSecondary}
            />

            <Text style={[styles.emailText, { color: colors.textSecondary }]}>
              {correo}
            </Text>
          </View>
          {guardando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />

              <Text style={{ color: colors.textSecondary }}>
                {t('editProfileSaving')}
              </Text>
            </View>
          ) : (
            <CustomButton
              title={t('editProfileSaveButton')}
              onPress={handleGuardarPerfil}
            />
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>


  );

}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
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

  keyboardView: {
    flex: 1,
  },

  readonlyEmail: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  emailText: {
    flex: 1,
    fontSize: 14,
  },

  loadingContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppSelector } from '../../redux/hooks';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function EnterEquipmentCodeScreen({ navigation }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 3. Obtenemos la función t desde LanguageContext para mostrar los textos traducidos.
  const { t } = useLanguage();

  // 4. Leemos los equipos registrados para validar el codigo ingresado.
  const equipments = useAppSelector((state) => state.equipment.equipments);

  // 5. Estado local del codigo escrito por el tecnico.
  const [codigo, setCodigo] = useState('');

  // 6. Valida que el codigo exista dentro del inventario antes de continuar.
  const handleContinuar = () => {
    const equipo = equipments.find(
      (e) => e.codigo.toLowerCase() === codigo.trim().toLowerCase()
    );

    if (!equipo) {
      Alert.alert('Equipo no encontrado', 'Verifica que el código ingresado sea correcto.');
      return;
    }

    // 7. Navegamos al formulario de nuevo mantenimiento, enviando el codigo del equipo.
    navigation.navigate('NewMaintenanceScreen', { codigoEquipo: equipo.codigo });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 8. Encabezado con boton de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary }]}>Identificar equipo</Text>
      </View>

      <View style={styles.body}>
        <Ionicons name="keypad-outline" size={48} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Ingresa el código del equipo (EQ-xxxxx)
        </Text>
        <CustomInput
          type="text"
          placeholder="EQ-0001"
          value={codigo}
          onChange={setCodigo}
        />

        <CustomButton title="Continuar" onPress={handleContinuar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30 },
  title: { fontSize: 20, fontWeight: 'bold' },
  body: { paddingTop: 40 },
  label: { fontSize: 13, marginBottom: 6 },
});
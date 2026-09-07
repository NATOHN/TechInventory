import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { navigationRef } from '../../navigation/NavigationService';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfileTab() {
  // Obtenemos del ThemeContext:
  const { isDark, colors, toggleTheme } = useTheme();
  // Obtenemos la información del idioma desde LanguageContext.
  // t: obtiene el texto traducido.
  const { language, changeLanguage, t } = useLanguage();


  const handleLogout = () => {
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background} ]}>
      <Ionicons name='person-circle' size={100} color= {colors.primary} />
      <Text style={[styles.name, {color: colors.text}]}>{t("profile")}</Text>
      <Text style={[styles.role, {color: colors.textSecondary}]}>{t("technicianRole")}</Text>
      <View style={[styles.themeRow,]}>
          {/* 8. Texto descriptivo del switch */}
            <Text style={[styles.themeText, { color: colors.text }]}>{t("darkMode")}</Text>
            




            {/* 9. Switch nativo para activar o desactivar el tema */}
            <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#D1D5DB', true: colors.primary }}
                thumbColor={'#FFFFFF'}
            />
      </View>

      {/*Fila sencilla para seleccionar el idioma. Mostramos solamente las opciones ES y EN. */}
      <View style={styles.languageRow}>

          <Text style={[styles.languageLabel, { color: colors.text }]}>Idioma</Text>

          <View style={styles.languageOptions}>
              {/*Cambiamos la aplicación a español. */}
              <TouchableOpacity onPress={() => changeLanguage("es")}>
                  <Text style={[styles.languageOption,{ color: language === "es" ? colors.primary : colors.textSecondary,},]}>
                      ES
                  </Text>
              </TouchableOpacity>
              <Text style={{ color: colors.textSecondary }}> | </Text>
              {/*Cambiamos la aplicación a inglés. */}
              <TouchableOpacity onPress={() => changeLanguage("en")}>
                  <Text style={[styles.languageOption,{color : language === "en" ? colors.primary : colors.textSecondary,},]}>
                      EN
                  </Text>
              </TouchableOpacity>
          </View>
      </View>
      
      <CustomButton title={t("logout")} onPress={handleLogout} variant='danger' />
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

    languageRow: {
        width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    languageLabel: {
        fontSize: 15,
        fontWeight: '500',
    },

    languageOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    languageOption: {
        fontSize: 15,
        fontWeight: 'bold',
    },

});
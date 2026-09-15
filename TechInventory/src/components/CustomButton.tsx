import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, ThemeColors } from '../context/ThemeContext';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export default function CustomButton({ title, onPress, variant = 'primary' }: Props) {
  // Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  //Enviamos la variante del botón y los colores actuales
  // a la función que construye los estilos.
  const styles = getStyles(variant, colors);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

//getStyles recibe la variante del botón y la paleta
//correspondiente al tema actual.
const getStyles = (variant: 'primary' | 'secondary' | 'danger', colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 8,
      padding: 14,
      marginVertical: 8,
      alignItems: 'center',
      backgroundColor:
        variant === 'primary' ? colors.primary:
        variant === 'secondary' ? colors.surface : '#c0392b',
      //Agregamos un borde al botón secundario para que
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderColor: variant === 'secondary' ? colors.border : 'transparent',
    },

    text: { 
      //El texto cambia según el tipo de botón.
      color: 
        variant === 'primary'? colors.background:
        variant === 'secondary' ? colors.text : '#FFFFFF',
      fontWeight: 'bold', 
      fontSize: 16 
    },
  });
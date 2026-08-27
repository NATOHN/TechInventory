import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email.includes('@') && password.length >= 4) {
      navigation.navigate('MainTabs');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TechInventory</Text>
      <Text style={styles.subtitle}>Inicia sesion para continuar</Text>
      <CustomInput type='email' placeholder='Correo electronico' value={email} onChange={setEmail} />
      <CustomInput type='password' placeholder='Contrasena' value={password} onChange={setPassword} />
      <CustomButton title='Ingresar' onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
});
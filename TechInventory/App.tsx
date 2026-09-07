import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { navigationRef } from './src/navigation/NavigationService';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer ref={navigationRef}>
            <StackNavigator/>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
}



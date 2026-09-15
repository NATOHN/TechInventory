import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';


import StackNavigator from './src/navigation/StackNavigator';
import { navigationRef } from './src/navigation/NavigationService';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { store } from './src/redux/store';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <NavigationContainer ref={navigationRef}>
              <StackNavigator/>
          </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}



import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from './src/wrappers/theme-context';
import StackNavigation from './src/navigation/stack-navigation';
import {AppProvider} from './src/helper/storage.helper';

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;

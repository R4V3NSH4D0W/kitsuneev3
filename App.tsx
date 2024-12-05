import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from './src/wrappers/theme-context';
import BottomTabNavigation from './src/navigation/bottom-tab-navigation';
import StackNavigation from './src/navigation/stack-navigation';

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;

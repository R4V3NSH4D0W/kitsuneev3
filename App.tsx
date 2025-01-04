/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from './src/wrappers/theme-context';
import StackNavigation from './src/navigation/stack-navigation';
import {AppProvider} from './src/helper/storage.helper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import toastConfig from './src/ui/toast-config';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider>
        <AppProvider>
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
          <Toast config={toastConfig} position="bottom" bottomOffset={50} />
        </AppProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

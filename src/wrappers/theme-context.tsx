import React, {
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from 'react';
import {darkTheme, lightTheme, Theme} from '../constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');

      if (storedTheme) {
        setTheme(storedTheme === 'dark' ? darkTheme : lightTheme);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);

    await AsyncStorage.setItem(
      'theme',
      newTheme === lightTheme ? 'light' : 'dark',
    );
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

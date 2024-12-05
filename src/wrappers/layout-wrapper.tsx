import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from './theme-context';

interface ILayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({children}: ILayoutWrapperProps) {
  const {theme} = useTheme();
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
});

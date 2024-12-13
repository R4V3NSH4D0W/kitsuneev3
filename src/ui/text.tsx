import {StyleSheet, Text, TextStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../wrappers/theme-context';

interface IAATextProps {
  style?: TextStyle;
  ignoretheme?: boolean;
  children: React.ReactNode;
}

const AAText: React.FC<IAATextProps> = ({children, style, ignoretheme}) => {
  const {theme} = useTheme();
  return (
    <Text
      style={[styles.text, style, !ignoretheme && {color: theme.colors.text}]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
export default AAText;

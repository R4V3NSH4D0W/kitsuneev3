import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {useTheme} from '../wrappers/theme-context';

export default function Profile() {
  const {toggleTheme} = useTheme();
  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <AAText>Profile</AAText>
        <TouchableOpacity onPress={toggleTheme}>
          <AAText>Toggle Theme</AAText>
        </TouchableOpacity>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {},
});

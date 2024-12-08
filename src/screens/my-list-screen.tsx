import {StyleSheet, View} from 'react-native';
import React from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';

export default function MyList() {
  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <AAText>My List</AAText>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {},
});

import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import LayoutWrapper from '../../wrappers/layout-wrapper';
import AAText from '../../ui/text';
import {FontSize} from '../../constants/constants';

export default function InitalLoading() {
  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/icon.png')}
          style={styles.image}
        />
        <AAText style={styles.text}>Kitsunee</AAText>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: FontSize.xl,
  },
});

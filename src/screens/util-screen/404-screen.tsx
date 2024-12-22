import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import LayoutWrapper from '../../wrappers/layout-wrapper';
import AAText from '../../ui/text';

export default function ErrorScreen() {
  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/sorry.png')}
          style={styles.image}
        />
        <AAText style={styles.text}>Oops! Some Thing Went Wrong</AAText>
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
    marginTop: 20,
    fontSize: 20,
  },
});

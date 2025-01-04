import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {BaseToastProps} from 'react-native-toast-message';
import {Colors, FontSize} from '../constants/constants';
import AAText from './text';

const toastConfig = {
  success: ({text1, text2}: BaseToastProps) => (
    <View style={styles.successToast}>
      <Image
        source={require('../../assets/images/icon-256x256.png')}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <AAText ignoretheme style={styles.text1}>
          {text1}
        </AAText>
        {text2 ? (
          <AAText ignoretheme style={styles.text2}>
            {text2}
          </AAText>
        ) : null}
      </View>
    </View>
  ),
  error: ({text1, text2}: BaseToastProps) => (
    <View style={styles.errorToast}>
      <Image
        source={require('../../assets/images/icon-256x256.png')}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <AAText ignoretheme style={styles.text1}>
          {text1}
        </AAText>
        {text2 ? (
          <AAText ignoretheme style={styles.text2}>
            {text2}
          </AAText>
        ) : null}
      </View>
    </View>
  ),
};

export default toastConfig;

const styles = StyleSheet.create({
  successToast: {
    width: '95%',
    flexDirection: 'row',
    backgroundColor: Colors.LightGray,
    padding: 15,
    // marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderLeftWidth: 8,
    borderLeftColor: Colors.Pink,
  },
  errorToast: {
    width: '95%',
    flexDirection: 'row',
    backgroundColor: Colors.LightGray,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 12,
    borderLeftWidth: 8,
    borderLeftColor: Colors.Red,
  },
  textContainer: {
    marginLeft: 10,
  },
  text1: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.White,
  },
  text2: {
    fontSize: FontSize.xs,
    color: Colors.White,
  },
  icon: {
    width: 34,
    height: 34,
  },
});

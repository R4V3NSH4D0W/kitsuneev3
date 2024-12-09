import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import AAText from '../ui/text';
import {Colors} from '../constants/constants';

const NavBar = () => {
  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <AAText ignoretheme style={styles.titleText}>
          Kitsunee
        </AAText>
        <View style={styles.icons}>
          <Icons name="search" size={24} color={Colors.White} />
          <Icons name="notifications-outline" size={24} color={Colors.White} />
        </View>
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  navbar: {
    top: 80,
    zIndex: 1,
    width: '100%',
    position: 'absolute',
  },
  navbarContent: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  icons: {
    gap: 10,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.White,
  },
});

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../constants/constants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../constants/types';

type SearchScreenNavigationProp = NavigationProp<RootStackParamList, 'Search'>;
const NavBar = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <Image
          source={require('../../assets/images/icon-256x256.png')}
          style={styles.logo}
        />
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Icons name="search-outline" size={24} color={Colors.White} />
          </TouchableOpacity>
          <Icons name="notifications-outline" size={24} color={Colors.White} />
        </View>
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  navbar: {
    zIndex: 999,
    width: '100%',
    position: 'absolute',
  },
  navbarContent: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 20,
    justifyContent: 'space-between',
  },
  icons: {
    gap: 20,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.White,
  },
  logo: {
    height: 80,
    width: 70,
    objectFit: 'contain',
  },
});

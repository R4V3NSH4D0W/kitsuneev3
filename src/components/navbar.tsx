import React from 'react';
import {View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import AAText from '../ui/text';
import {Colors} from '../constants/constants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../constants/types';

type SearchScreenNavigationProp = NavigationProp<RootStackParamList, 'Search'>;
const NavBar = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <AAText ignoretheme style={styles.titleText}>
          Kitsunee
        </AAText>
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
    top: Platform.OS === 'ios' ? 80 : 20,
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
    gap: 20,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.White,
  },
});

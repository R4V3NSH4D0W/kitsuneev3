import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AAText from '../ui/text';
import AIcons from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../wrappers/theme-context';

interface ISecondaryNavBarProps {
  title: string;
  hasGoBack?: boolean;
  hasSearch?: boolean;
  logoEnabled?: boolean;
}

export default function SecondaryNavBar({
  title,
  hasGoBack,
  logoEnabled = true,
  hasSearch = true,
}: ISecondaryNavBarProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {theme} = useTheme();
  return (
    <View style={styles.navContainer}>
      <View style={styles.logoContainer}>
        {hasGoBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goBack}>
            <AIcons name="arrowleft" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        {logoEnabled && (
          <Image
            source={require('../../assets/images/icon-256x256.png')}
            style={styles.logo}
          />
        )}
        <AAText style={styles.navText}>{title}</AAText>
      </View>

      {hasSearch && (
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <AIcons name="search1" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    height: 60,
    width: 50,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingRight: 20,
    marginTop: 10,
  },
  navText: {
    fontSize: 20,
    fontWeight: '600',
  },
  goBack: {
    paddingRight: 10,
  },
});

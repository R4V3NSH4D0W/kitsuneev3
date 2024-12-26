import React, {useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {useTheme} from '../wrappers/theme-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../constants/constants';
import SecondaryNavBar from '../components/secondary-navbar';

export default function Settings() {
  const {toggleTheme, theme} = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme.dark);

  const toggleAnim = new Animated.Value(isDarkMode ? 1 : 0);

  const handleToggle = () => {
    Animated.timing(toggleAnim, {
      toValue: isDarkMode ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  const togglePosition = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  return (
    <LayoutWrapper>
      <SecondaryNavBar title="Settings" hasSearch={false} />
      <View style={styles.container}>
        <View style={styles.themeContainer}>
          <AAText style={styles.themeText}>
            Theme Mode {isDarkMode ? '(Dark)' : '(Light)'}
          </AAText>
          <TouchableOpacity
            onPress={handleToggle}
            style={styles.toggleContainer}>
            <View style={styles.switch}>
              <Animated.View
                style={[
                  styles.toggleCircle,
                  {transform: [{translateX: togglePosition}]},
                ]}>
                <Icon
                  name={isDarkMode ? 'moon-o' : 'sun-o'}
                  size={16}
                  color={Colors.Pink}
                  style={styles.icon}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeText: {
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    backgroundColor: '#ccc',
    borderRadius: 30,
    justifyContent: 'center',
    padding: 5,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Adds shadow to the circle
  },
  icon: {
    position: 'absolute',
  },
});

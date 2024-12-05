import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import FIcons from 'react-native-vector-icons/Feather';
import AAButton from '../ui/button';
import AAText from '../ui/text';
import {Colors} from '../constants/constants';

const {height, width} = Dimensions.get('window');

// Navbar Component
const NavBar = () => (
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

// Slider Component
const Slider = () => {
  const handlePlayPress = () => console.log('Play Pressed');
  const handleMyListPress = () => console.log('My List Pressed');

  return (
    <View style={styles.sliderContainer}>
      {/* Navbar */}
      <NavBar />
      {/* Background Image */}
      <Image
        source={{uri: 'https://w.wallhaven.cc/full/9d/wallhaven-9dp3y1.jpg'}}
        style={styles.image}
      />
      {/* Overlay */}
      <View style={styles.overlay} />
      {/* Slider Content */}
      <View style={styles.sliderContent}>
        <AAText ignoretheme style={styles.titleText}>
          Demon Slayer
        </AAText>
        <AAText ignoretheme style={styles.subText}>
          Action, Shounen
        </AAText>
        <View style={styles.controller}>
          <AAButton
            title="Play"
            ignoreTheme
            style={[styles.button, styles.greenButton]}
            textStyle={styles.text}
            onPress={handlePlayPress}
            icon={<Icons name="play-circle" size={20} color={Colors.White} />}
          />
          <AAButton
            title="My List"
            ignoreTheme
            style={styles.button}
            textStyle={styles.text}
            onPress={handleMyListPress}
            icon={<FIcons name="plus" size={20} color={Colors.White} />}
          />
        </View>
      </View>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: height / 3,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sliderContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.White,
  },
  subText: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.White,
  },
  text: {
    fontSize: 18,
    color: Colors.White,
  },
  controller: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.White,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  greenButton: {
    backgroundColor: Colors.Green,
    borderColor: Colors.Green,
  },
  navbar: {
    position: 'absolute',
    top: 20,
    zIndex: 1,
    width: '100%',
  },
  navbarContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    gap: 20,
  },
});

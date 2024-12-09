import React from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import FIcons from 'react-native-vector-icons/Feather';
import {Dimensions, Image, StyleSheet, View, FlatList} from 'react-native';

import AAText from '../ui/text';
import AAButton from '../ui/button';

import {Colors} from '../constants/constants';
import {ISpotLightResult} from '../constants/types';

const {height, width} = Dimensions.get('window');

interface ISliderProps {
  data: ISpotLightResult[];
}

interface ISliderItemProps {
  item: ISpotLightResult;
}
const SliderItem = ({item}: ISliderItemProps) => (
  <View style={styles.slide}>
    <Image source={{uri: item.banner}} style={styles.image} />

    <View style={styles.overlay} />
    <View style={styles.sliderContent}>
      <AAText ignoretheme style={styles.titleText}>
        #{item.rank} spotlight
      </AAText>
      <AAText ignoretheme style={styles.subText}>
        {item.title}
      </AAText>
      <View style={styles.controller}>
        <AAButton
          title="Play"
          ignoreTheme
          textStyle={styles.text}
          style={[styles.button, styles.greenButton]}
          onPress={() => console.log('Play Pressed')}
          icon={<Icons name="play-circle" size={20} color={Colors.White} />}
        />
        <AAButton
          title="My List"
          ignoreTheme
          style={styles.button}
          textStyle={styles.text}
          onPress={() => console.log('My List Pressed')}
          icon={<FIcons name="plus" size={20} color={Colors.White} />}
        />
      </View>
    </View>
  </View>
);

const Slider = ({data}: ISliderProps) => {
  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        renderItem={({item}) => <SliderItem item={item} />}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'relative',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',

    color: Colors.White,
  },
  slide: {
    position: 'relative',
    width,
    height: height / 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sliderContent: {
    left: 20,
    bottom: 20,
    position: 'absolute',
  },
  subText: {
    fontSize: 20,
    maxWidth: 400,
    fontWeight: '400',
    paddingVertical: 5,
    color: Colors.White,
  },
  controller: {
    gap: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderColor: Colors.White,
    gap: 5,
  },
  greenButton: {
    borderColor: Colors.Green,
    backgroundColor: Colors.Green,
  },
  text: {
    color: Colors.White,
  },
});

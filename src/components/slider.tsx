import React from 'react';
import {Dimensions, Image, StyleSheet, View, FlatList} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import FIcons from 'react-native-vector-icons/Feather';
import AAButton from '../ui/button';
import AAText from '../ui/text';
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
          style={[styles.button, styles.greenButton]}
          textStyle={styles.text}
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
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
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
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  subText: {
    paddingVertical: 5,
    fontSize: 20,
    fontWeight: '400',
    maxWidth: 400,
    color: Colors.White,
  },
  controller: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.White,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  greenButton: {
    backgroundColor: Colors.Green,
    borderColor: Colors.Green,
  },
  text: {
    color: Colors.White,
  },
});

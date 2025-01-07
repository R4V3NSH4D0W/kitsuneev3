import React, {useState, useEffect} from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import FIcons from 'react-native-vector-icons/Feather';
import {Dimensions, Image, StyleSheet, View, FlatList} from 'react-native';

import AAText from '../ui/text';
import AAButton from '../ui/button';

import {Colors, FontSize} from '../constants/constants';
import {ISpotLightResult} from '../constants/types';
import {useMyList} from '../helper/storage.helper';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../wrappers/theme-context';
import {getAnimeDetail} from '../helper/api.helper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const {height, width} = Dimensions.get('window');

interface ISliderProps {
  data: ISpotLightResult[];
}

interface ISliderItemProps {
  item: ISpotLightResult;
}

const SliderItem = ({item}: ISliderItemProps) => {
  const {addToList, removeFromList, isInList} = useMyList();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const isInMyList = isInList(item.id);
  const {theme} = useTheme();

  const [animeInfo, setAnimeInfo] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAnimeDetails = async () => {
      try {
        const details = await getAnimeDetail(item.id);
        if (isMounted) {
          setAnimeInfo(details);
        }
      } catch (error) {
        console.error('Failed to fetch anime details:', error);
      }
    };

    fetchAnimeDetails();
    return () => {
      isMounted = false;
    };
  }, [item.id]);

  const onPlay = () => {
    if (!animeInfo) {
      console.warn('Anime details not loaded yet.');
      return;
    }

    const episodesouces = animeInfo?.episodes[0].id;
    const episodeNumber = animeInfo?.episodes[0].number;

    navigation.navigate('VideoScreen', {
      id: episodesouces,
      episodeNumber: episodeNumber,
    });
  };

  const handleBookmark = async () => {
    if (isInMyList) {
      await removeFromList(item.id);
    } else {
      await addToList(item.id);
    }
  };

  return (
    <View style={styles.slide}>
      <Image source={{uri: item.banner}} style={styles.image} />
      <View style={styles.overlay} />
      <LinearGradient
        colors={['transparent', theme.colors.background]}
        style={styles.gradient}
      />
      <View style={styles.sliderContent}>
        <AAText style={styles.titleText}>#{item.rank} spotlight</AAText>
        <AAText style={styles.subText}>{item.title}</AAText>
        <View style={styles.controller}>
          <AAButton
            title="Play"
            ignoreTheme
            textStyle={styles.text}
            style={[styles.button, styles.PinkButton]}
            onPress={onPlay}
            icon={
              <Icons
                name="play-circle"
                size={FontSize.md}
                color={Colors.White}
              />
            }
          />
          <AAButton
            title="My List"
            ignoreTheme
            style={{
              ...styles.button,
              borderColor: isInMyList
                ? Colors.Pink
                : theme.dark
                ? Colors.White
                : Colors.LightGray,
            }}
            textStyle={{
              ...styles.text,
              color: isInMyList
                ? Colors.Pink
                : theme.dark
                ? Colors.White
                : Colors.LightGray,
            }}
            onPress={handleBookmark}
            icon={
              <FIcons
                size={FontSize.md}
                name={isInMyList ? 'check' : 'plus'}
                color={
                  isInMyList
                    ? Colors.Pink
                    : theme.dark
                    ? Colors.White
                    : Colors.LightGray
                }
              />
            }
          />
        </View>
      </View>
    </View>
  );
};

const Slider = ({data}: ISliderProps) => {
  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
        windowSize={5}
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
    fontSize: FontSize.md,
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sliderContent: {
    left: 20,
    bottom: 20,
    zIndex: 999,
    position: 'absolute',
  },
  subText: {
    fontSize: FontSize.xmd,
    maxWidth: 380,
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
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderColor: Colors.White,
    gap: 5,
  },
  PinkButton: {
    borderColor: Colors.Pink,
    backgroundColor: Colors.Pink,
  },
  text: {
    color: Colors.White,
    fontSize: FontSize.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  gradient: {
    zIndex: 1,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

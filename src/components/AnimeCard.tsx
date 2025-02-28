import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import AAText from '../ui/text';
import {Colors, FontSize} from '../constants/constants';
import {AnimeResult} from '../constants/types';
interface IAnimeCardProps {
  title: string;
  data: AnimeResult[];
  hideSeeAll?: boolean;
}

interface IImageSliderProps {
  data: AnimeResult;
}

const ImageSlider = ({data}: IImageSliderProps) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{
          uri: data.image || 'https://via.placeholder.com/300',
        }}
        style={styles.image}
      />
      <AAText ignoretheme style={styles.type}>
        {data?.type}
      </AAText>
    </View>
  );
};

const AnimeCard = ({title, data, hideSeeAll}: IAnimeCardProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };

  const handelnavigationToSeeAll = (type: string) => {
    navigation.navigate('SeeAll', {type});
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <AAText style={styles.title}>{title}</AAText>
        {hideSeeAll ? null : (
          <TouchableOpacity onPress={() => handelnavigationToSeeAll(title)}>
            <AAText ignoretheme style={styles.titleButton}>
              See all
            </AAText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigateToDetail(item.id)}>
            <ImageSlider data={item} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default AnimeCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingLeft: 10,
  },
  title: {
    fontSize: FontSize.xmd,
    fontFamily: 'Poppins-SemiBold',
  },
  titleRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleButton: {
    fontSize: FontSize.sm,
    paddingRight: 20,
    color: Colors.Pink,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    objectFit: 'cover',
  },
  imageContainer: {
    height: 200,
    width: 140,
    marginRight: 10,
    marginBottom: 10,
  },
  type: {
    top: 10,
    right: 10,
    position: 'absolute',
    backgroundColor: Colors.Pink,
    color: Colors.White,
    fontSize: FontSize.xmd,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});

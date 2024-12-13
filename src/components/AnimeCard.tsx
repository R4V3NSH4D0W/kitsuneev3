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
import {Colors} from '../constants/constants';
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
      <AAText style={styles.type}>{data?.type}</AAText>
    </View>
  );
};

const AnimeCard = ({title, data, hideSeeAll}: IAnimeCardProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <AAText style={styles.title}>{title}</AAText>
        {hideSeeAll ? null : (
          <AAText ignoretheme style={styles.titleButton}>
            See all
          </AAText>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  titleRow: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleButton: {
    fontSize: 16,
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
    marginRight: 20,
    marginBottom: 10,
  },
  type: {
    top: 10,
    right: 10,
    position: 'absolute',
    backgroundColor: Colors.Pink,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});

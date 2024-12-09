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
}

interface IImageSliderProps {
  data: AnimeResult;
}

const ImageSlider = ({data}: IImageSliderProps) => {
  return (
    <Image
      source={{
        uri: data.image || 'https://via.placeholder.com/300',
      }}
      style={styles.image}
    />
  );
};

const AnimeCard = ({title, data}: IAnimeCardProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <AAText style={styles.title}>{title}</AAText>
        <AAText ignoretheme style={styles.titleButton}>
          See all
        </AAText>
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
    fontSize: 24,
    fontWeight: '500',
  },
  titleRow: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleButton: {
    fontSize: 16,
    color: Colors.Green,
  },
  image: {
    width: 200,
    height: 250,
    marginRight: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
});

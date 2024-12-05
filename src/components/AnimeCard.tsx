import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {AnimeResult} from '../constants/types';
import AAText from '../ui/text';
import {Colors} from '../constants/constants';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
interface IAnimeCardProps {
  title: string;
  isloading: boolean;
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

const AnimeCard = ({title, data, isloading}: IAnimeCardProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };

  if (isloading) {
    return (
      <View style={styles.container}>
        <AAText>Loading...</AAText>
      </View>
    );
  }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleButton: {
    fontSize: 16,
    color: Colors.Green,
  },
  image: {
    width: 200,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 20,
  },
});

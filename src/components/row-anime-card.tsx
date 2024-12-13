import {
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {AnimeResult} from '../constants/types';
import AAText from '../ui/text';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../constants/constants';
import AIcons from 'react-native-vector-icons/AntDesign';

interface IRowAnimeCard {
  data: AnimeResult[];
}

export default function RowAnimeCard({data}: IRowAnimeCard) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };

  const renderAnimeItem = ({item}: {item: AnimeResult}) => {
    return (
      <TouchableOpacity
        style={styles.animeCard}
        onPress={() => navigateToDetail(item.id)}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.image}} style={styles.animeImage} />
          <View style={styles.icon}>
            <AIcons name="play" size={30} color={Colors.White} />
          </View>
        </View>
        <AAText style={styles.animeTitle}>{item.title}</AAText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderAnimeItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginBottom: 80,
  },
  animeCard: {
    marginRight: 10,
    marginBottom: 20,
    gap: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  animeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  animeTitle: {
    marginTop: 5,
    fontSize: 16,
    width: '50%',
  },
  imageContainer: {
    width: 150,
    height: 120,
  },
  icon: {
    position: 'absolute',
    top: '40%',
    left: '40%',
  },
});

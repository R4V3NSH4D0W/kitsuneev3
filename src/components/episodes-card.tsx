import {
  View,
  Image,
  Keyboard,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import AAText from '../ui/text';
import {Episode} from '../constants/types';
import {Colors} from '../constants/constants';
import AIcons from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../wrappers/theme-context';

interface IEpisodeCardProps {
  data: Episode[];

  image?: string;
}

const renderEpisode = ({
  item,
  defaultImage,
}: {
  item: Episode;
  defaultImage: string;
}) => (
  <View style={styles.imageContainer}>
    <Image source={{uri: defaultImage}} style={styles.image} />
    <AAText ignoretheme style={styles.imageText}>
      Episode {item.number}
    </AAText>
    <AIcons
      name="play"
      size={30}
      color={Colors.White}
      style={styles.playIcon}
    />
    {/* <View style={styles.overlay} /> */}
  </View>
);

export default function EpisodeCard({data, image}: IEpisodeCardProps) {
  const defaultImage =
    image || 'https://w.wallhaven.cc/full/9d/wallhaven-9dqojx.jpg';
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const {theme} = useTheme();

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredData(data);
    } else {
      const episodeNumber = parseInt(text, 10);
      const filtered = data.filter(episode => episode.number === episodeNumber);
      setFilteredData(filtered);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.episodeContainer}>
          <AAText style={styles.titleText}>Episodes</AAText>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View
              style={[
                styles.searchContainer,
                {borderColor: theme.colors.text},
              ]}>
              <AIcons name="search1" size={20} color={theme.colors.text} />
              <TextInput
                style={[styles.input, {color: theme.colors.text}]}
                placeholderTextColor={theme.colors.text}
                placeholder="Search Episode"
                value={searchText}
                onChangeText={handleSearch}
                keyboardType="numeric"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('VideoScreen', {
                id: item.id,
                episodeNumber: item.number,
              })
            }>
            {renderEpisode({item, defaultImage})}
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        horizontal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
  },
  episodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: 200,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 120,
    marginRight: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    marginTop: 20,
  },
  imageText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: Colors.White,
    zIndex: 1,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '45%',
    transform: [{translateX: -15}, {translateY: -15}],
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

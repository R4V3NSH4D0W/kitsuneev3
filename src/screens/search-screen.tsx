import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../constants/constants';
import {useTheme} from '../wrappers/theme-context';
import AIcons from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {getAnimeSearchResults, getMostFavorite} from '../helper/api.helper';
import {AnimeResult} from '../constants/types';
import AnimeItemCard from '../components/anime-items-cards';
import {FlatList} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import RowAnimeCard from '../components/row-anime-card';

export default function SearchScreen() {
  const {theme} = useTheme();
  const [searchText, setSearchText] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mostfavorite, setMostFavorite] = useState<AnimeResult[]>([]);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    if (debouncedValue) {
      fetchSearchResults(debouncedValue);
    }
  }, [debouncedValue]);

  const fetchSearchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await getAnimeSearchResults(query);
      setLoading(false);
      setSearchResults(response.results);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    fetchMostWatched();
  }, []);

  const fetchMostWatched = async () => {
    setLoading(true);
    try {
      const response = await getMostFavorite();
      setLoading(false);
      setMostFavorite(response.results);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const renderAnimeItem = ({item}: {item: any}) => (
    <AnimeItemCard
      title={item.title}
      image={item.image}
      onPress={() => navigateToDetail(item.id)}
    />
  );
  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color={theme.colors.text} />
          </TouchableOpacity>
          <View
            style={[
              styles.searchContainer,
              {backgroundColor: theme.colors.alt},
            ]}>
            <AIcons name="search1" size={20} color={theme.colors.text} />
            <TextInput
              style={[styles.searchInput, {color: theme.colors.text}]}
              placeholder="Search"
              placeholderTextColor={theme.colors.text}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('SortAndFilter')}>
            <Icon name="options" size={30} color={Colors.Pink} />
          </TouchableOpacity>
        </View>
        {!loading && (
          <FlatList
            data={searchResults}
            showsVerticalScrollIndicator={false}
            renderItem={renderAnimeItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        )}
        {searchText.length === 0 && !loading && (
          <RowAnimeCard data={mostfavorite} />
        )}
      </View>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      )}
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  searchContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 14,
    height: 50,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
  },
  option: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 192, 203, 0.2)',
    width: 50,
  },
  row: {
    justifyContent: 'space-between',
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

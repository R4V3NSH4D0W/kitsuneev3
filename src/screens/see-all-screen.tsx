import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {
  AnimeResponse,
  AnimeResult,
  RootStackParamList,
} from '../constants/types';
import {RouteProp, useNavigation} from '@react-navigation/native';
import SecondaryNavBar from '../components/secondary-navbar';
import {
  getMostFavorite,
  getMovie,
  getPopularAnime,
  getRecentlyUpdated,
  getTopAiringAnime,
} from '../helper/api.helper';
import {Colors, FontSize} from '../constants/constants';
import {trimTitle} from '../helper/util.helper';
import AAButton from '../ui/button';
import {useMyList} from '../helper/storage.helper';
import FIcons from 'react-native-vector-icons/Feather';
import {useTheme} from '../wrappers/theme-context';
import {StackNavigationProp} from '@react-navigation/stack';
import SeeAllSkeleton from '../utils/skeleton-loaders/see-all-skeleton';

type SeeAllScreenProps = {
  route: RouteProp<RootStackParamList, 'SeeAll'>;
};

export default function SeeAllScreen({route}: SeeAllScreenProps) {
  const {type} = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [animeList, setAnimeList] = useState<AnimeResult[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const {addToList, removeFromList, isInList} = useMyList();
  const {theme} = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page]);

  const fetchData = async () => {
    setLoading(true);
    switch (type) {
      case 'Top Airing':
        await fetchTopAiring();
        break;
      case 'New Episode Releases':
        await fetchNewEpisodeRelease();
        break;
      case 'Most Popular':
        await fetchPopularAnime();
        break;
      case 'Most Favorite':
        await fetchMostFavorite();
        break;
      case 'Movies':
        await fetchMovies();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  const fetchTopAiring = async () => {
    try {
      const response = await getTopAiringAnime(page);
      handlePaginatedResponse(response, setAnimeList, setHasNextPage);
    } catch (error) {
      console.error('Error fetching Top Airing Anime:', error);
    }
  };

  const fetchNewEpisodeRelease = async () => {
    try {
      const response = await getRecentlyUpdated(page);
      handlePaginatedResponse(response, setAnimeList, setHasNextPage);
    } catch (error) {
      console.error('Error fetching Top Airing Anime:', error);
    }
  };

  const fetchMostFavorite = async () => {
    try {
      const response = await getMostFavorite(page);
      handlePaginatedResponse(response, setAnimeList, setHasNextPage);
    } catch (error) {
      console.error('Error fetching Top Airing Anime:', error);
    }
  };

  const fetchPopularAnime = async () => {
    try {
      const response = await getPopularAnime(page);
      handlePaginatedResponse(response, setAnimeList, setHasNextPage);
    } catch (error) {
      console.error('Error fetching Top Airing Anime:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await getMovie(page);
      handlePaginatedResponse(response, setAnimeList, setHasNextPage);
    } catch (error) {
      console.error('Error fetching Top Airing Anime:', error);
    }
  };

  const handlePaginatedResponse = (
    response: AnimeResponse,
    setList: React.Dispatch<React.SetStateAction<AnimeResult[]>>,
    updateHasNextPage: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setList(prev => [...prev, ...response.results]);
    updateHasNextPage(response.hasNextPage);
  };

  const loadMoreAnime = () => {
    if (hasNextPage && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderAnimeItem = ({item}: {item: AnimeResult}) => {
    const isInMyList = isInList(item.id);

    const handlePress = async () => {
      if (isInMyList) {
        await removeFromList(item.id);
      } else {
        await addToList(item.id);
      }
    };

    const navigateToDetail = (id: string) => {
      navigation.navigate('Detail', {id});
    };

    return (
      <View style={styles.animeCard}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => navigateToDetail(item.id)}>
            <Image source={{uri: item.image}} style={styles.animeImage} />
          </TouchableOpacity>
          <AAText ignoretheme style={styles.type}>
            {item.type}
          </AAText>
        </View>
        <View style={styles.animeDetails}>
          <AAText style={styles.title}>{trimTitle(item.title, 45)}</AAText>
          <AAText style={styles.duration}>{item.duration}</AAText>
          <AAButton
            ignoreTheme
            title={'My List'}
            style={[
              styles.button,
              isInMyList && {backgroundColor: theme.colors.background},
            ]}
            textStyle={
              isInMyList
                ? {color: Colors.Pink, fontSize: FontSize.sm}
                : styles.text
            }
            onPress={handlePress}
            icon={
              <FIcons
                size={20}
                name={isInMyList ? 'check' : 'plus'}
                color={isInMyList ? Colors.Pink : Colors.White}
              />
            }
          />
        </View>
      </View>
    );
  };

  // if (loading && animeList.length === 0) {
  //   return (
  //     <LayoutWrapper>
  //       <View style={styles.loadingContainer}>
  //         {/* <ActivityIndicator size="large" color={Colors.Pink} /> */}
  //         <SeeAllSkeleton />
  //       </View>
  //     </LayoutWrapper>
  //   );
  // }

  return (
    <LayoutWrapper>
      <SecondaryNavBar title={type} hasGoBack logoEnabled={false} />
      <View style={styles.container}>
        {loading && animeList.length === 0 ? (
          <SeeAllSkeleton />
        ) : (
          <FlatList
            data={animeList}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderAnimeItem}
            onEndReached={loadMoreAnime}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              loading ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size={'large'} color={Colors.Pink} />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  loadingMore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  animeCard: {
    flexDirection: 'row',
    marginBottom: 16,
    overflow: 'hidden',
  },
  animeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imageContainer: {
    width: 140,
    height: 160,
  },
  type: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: FontSize.xmd,
    backgroundColor: Colors.Pink,
    color: Colors.White,
    paddingHorizontal: 4,
    borderRadius: 5,
  },
  animeDetails: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: FontSize.sm,
    fontFamily: 'Poppins-Regular',
  },
  duration: {
    paddingVertical: 2,
    fontSize: FontSize.xs,
  },
  button: {
    marginTop: 10,
    paddingVertical: 2,

    width: 100,
    borderRadius: 15,
    borderColor: Colors.Pink,
    backgroundColor: Colors.Pink,
  },
  text: {
    fontSize: FontSize.sm,
    color: Colors.White,
    paddingRight: 4,
  },
});

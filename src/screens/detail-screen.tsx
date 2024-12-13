import {
  View,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';

import {useTheme} from '../wrappers/theme-context';
import LayoutWrapper from '../wrappers/layout-wrapper';

import AAText from '../ui/text';
import AAButton from '../ui/button';

import {Colors} from '../constants/constants';
import {Anime, RootStackParamList} from '../constants/types';

import AnimeCard from '../components/AnimeCard';
import EpisodeCard from '../components/episodes-card';

import {getAnimeDetail} from '../helper/api.helper';
import {useMyList} from '../helper/storage.helper';

type DetailScreenProps = {
  route: RouteProp<RootStackParamList, 'Detail'>;
};

const LoadingIndicator = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.Pink} />
    </View>
  );
};

const Banner = ({
  image,
  onBackPress,
}: {
  image: string | undefined;
  onBackPress: () => void;
}) => (
  <View style={styles.banner}>
    <TouchableOpacity style={styles.backIcon} onPress={onBackPress}>
      <Icons name="arrow-back" size={30} color={Colors.White} />
    </TouchableOpacity>
    <Image
      source={{uri: image || 'https://via.placeholder.com/300'}}
      style={styles.image}
    />
    <View style={styles.overlay} />
  </View>
);

const GenreList = ({genres}: {genres: string[]}) => (
  <FlatList
    horizontal
    data={genres}
    keyExtractor={item => item}
    renderItem={({item}) => (
      <AAButton
        title={item}
        ignoreTheme
        onPress={() => {}}
        style={styles.genreButton}
        textStyle={styles.genreText}
      />
    )}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.genreListContainer}
  />
);

const DetailScreen = ({route}: DetailScreenProps) => {
  const {id} = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);
  const {addToList, removeFromList, isInList} = useMyList();

  const {theme} = useTheme();
  const navigation = useNavigation();

  const fetchAnimeInfo = useCallback(async () => {
    setLoading(true);
    try {
      const result: Anime = await getAnimeDetail(id);
      setAnimeInfo(result || null);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnimeInfo();
  }, [id, fetchAnimeInfo]);

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const renderDescription = () => {
    if (!animeInfo?.description) {
      return null;
    }

    const truncatedDescription =
      animeInfo.description.length > 250
        ? `${animeInfo.description.slice(0, 250)}...`
        : animeInfo.description;

    return (
      <AAText style={styles.descriptionText}>
        {isExpanded ? animeInfo.description : truncatedDescription}
        {animeInfo.description.length > 250 && (
          <TouchableOpacity onPress={handleToggleExpand}>
            <AAText ignoretheme style={styles.viewMoreText}>
              {isExpanded ? ' View Less' : ' View More'}
            </AAText>
          </TouchableOpacity>
        )}
      </AAText>
    );
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <LoadingIndicator />
      </LayoutWrapper>
    );
  }

  const isInMyList = isInList(animeInfo?.id || '');

  const handlePress = async () => {
    if (isInMyList) {
      await removeFromList(animeInfo?.id || '');
    } else {
      await addToList(animeInfo?.id || '');
    }
  };

  return (
    <LayoutWrapper>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Banner
          image={animeInfo?.image}
          onBackPress={() => navigation.goBack()}
        />

        <View style={styles.row}>
          <AAText style={styles.titleText}>{animeInfo?.title}</AAText>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handlePress()}>
              {isInMyList ? (
                <Icons size={30} name="bookmark-outline" color={Colors.Pink} />
              ) : (
                <Icons
                  size={30}
                  name="bookmark-outline"
                  color={theme.colors.text}
                />
              )}
            </TouchableOpacity>
            <Icons
              size={30}
              name="share-social-outline"
              color={theme.colors.text}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.infoContainer}>
            <AAText>{animeInfo?.releaseDate}</AAText>
            <AAText style={styles.statusText}>{animeInfo?.status}</AAText>
          </View>
          <GenreList genres={animeInfo?.genres || []} />
        </View>

        <View style={styles.controllerRow}>
          <AAButton
            title="Play"
            ignoreTheme
            onPress={() => {}}
            textStyle={styles.buttonTextAlt}
            style={[styles.buttonAlt, styles.controllerButton]}
            icon={<Icons name="play-circle" size={20} color={Colors.White} />}
          />
          <AAButton
            ignoreTheme
            title="Download"
            onPress={() => {}}
            textStyle={styles.buttonText}
            style={[styles.button, styles.controllerButton]}
            icon={<Icons name="download" size={20} color={Colors.Pink} />}
          />
        </View>
        <View style={styles.description}>{renderDescription()}</View>
        <EpisodeCard
          data={animeInfo?.episodes ?? []}
          image={animeInfo?.image}
        />
        <AnimeCard
          title="More Like This"
          hideSeeAll
          data={animeInfo?.recommendations || []}
        />
      </ScrollView>
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 40},
  descriptionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    lineHeight: 24,
  },
  description: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  viewMoreText: {
    marginBottom: -3,
    color: Colors.Pink,
    textDecorationLine: 'underline',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    position: 'relative',
  },
  backIcon: {
    top: 20,
    left: 20,
    zIndex: 1,
    position: 'absolute',
  },
  image: {
    height: 300,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  controllerRow: {
    marginTop: -10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  iconContainer: {
    gap: 20,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 22,
    maxWidth: '70%',
    fontWeight: '600',
  },
  statusText: {
    color: Colors.Pink,
  },
  genreListContainer: {
    paddingLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  genreButton: {
    marginRight: 10,
    borderRadius: 10,
    borderColor: Colors.Pink,
  },
  genreText: {
    color: Colors.Pink,
  },
  button: {
    borderRadius: 10,
    borderColor: Colors.Pink,
  },
  buttonAlt: {
    borderRadius: 10,
    borderColor: Colors.Pink,
    backgroundColor: Colors.Pink,
  },
  buttonText: {
    color: Colors.Pink,
  },
  controllerButton: {
    width: '48%',
    borderRadius: 20,
  },
  buttonTextAlt: {
    color: Colors.White,
  },
  infoContainer: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DetailScreen;

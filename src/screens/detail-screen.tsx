import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {Anime, RootStackParamList} from '../constants/types';
import {getAnimeDetail} from '../helper/api.helper';
import {useTheme} from '../wrappers/theme-context';
import Icons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../constants/constants';
import AAButton from '../ui/button';
import EpisodeCard from '../components/episodes-card';
import AnimeCard from '../components/AnimeCard';

type DetailScreenProps = {
  route: RouteProp<RootStackParamList, 'Detail'>;
};

const LoadingIndicator = () => {
  const {theme} = useTheme();
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={theme.colors.text} />
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
    data={genres}
    horizontal
    keyExtractor={item => item}
    renderItem={({item}) => (
      <AAButton
        onPress={() => {}}
        title={item}
        ignoreTheme
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
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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
            <Icons
              name="bookmark-outline"
              size={30}
              color={theme.colors.text}
            />
            <Icons
              name="share-social-outline"
              size={30}
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
            onPress={() => {}}
            ignoreTheme
            style={[styles.buttonAlt, styles.controllerButton]}
            textStyle={styles.buttonTextAlt}
            icon={<Icons name="play-circle" size={20} color={Colors.White} />}
          />
          <AAButton
            title="Download"
            onPress={() => {}}
            ignoreTheme
            style={[styles.button, styles.controllerButton]}
            textStyle={styles.buttonText}
            icon={<Icons name="download" size={20} color={Colors.Green} />}
          />
        </View>
        <View style={styles.description}>{renderDescription()}</View>
        <EpisodeCard data={animeInfo?.episodes ?? []} />
        <AnimeCard
          title="Recommendations"
          data={animeInfo?.recommendations || []}
        />
      </ScrollView>
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 40},
  descriptionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    lineHeight: 24,
  },
  description: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  viewMoreText: {
    color: Colors.Green,
    marginBottom: -3,
    textDecorationLine: 'underline',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    position: 'relative',
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  controllerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -10,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  titleText: {
    maxWidth: '70%',
    fontSize: 22,
    fontWeight: '600',
  },
  statusText: {
    color: Colors.Green,
  },
  genreListContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  genreButton: {
    borderColor: Colors.Green,
    borderRadius: 10,
    marginRight: 10,
  },
  genreText: {
    color: Colors.Green,
  },
  button: {
    borderColor: Colors.Green,
    borderRadius: 10,
  },
  buttonAlt: {
    borderColor: Colors.Green,
    borderRadius: 10,
    backgroundColor: Colors.Green,
  },
  buttonText: {
    color: Colors.Green,
  },
  controllerButton: {
    width: '48%',
    borderRadius: 20,
  },
  buttonTextAlt: {
    color: Colors.White,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default DetailScreen;

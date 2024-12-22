import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

import {useTheme} from '../wrappers/theme-context';
import LayoutWrapper from '../wrappers/layout-wrapper';

import AAText from '../ui/text';
import AAButton from '../ui/button';

import {Colors, FontSize} from '../constants/constants';
import {Anime, RootStackParamList} from '../constants/types';

import AnimeCard from '../components/AnimeCard';
import EpisodeCard from '../components/episodes-card';

import {getAnimeDetail} from '../helper/api.helper';
import {useMyList} from '../helper/storage.helper';
import {trimTitle} from '../helper/util.helper';
import SkeletonDetail from '../utils/skeleton-loaders/detail-skeleton';
import {RefreshControl} from 'react-native-gesture-handler';

type DetailScreenProps = {
  route: RouteProp<RootStackParamList, 'Detail'>;
};

// const LoadingIndicator = () => {
//   return (
//     <View style={styles.loading}>
//       <ActivityIndicator size="large" color={Colors.Pink} />
//     </View>
//   );
// };

const Banner = ({
  image,
  onBackPress,
}: {
  image: string | undefined;
  onBackPress: () => void;
}) => (
  <View style={styles.banner}>
    <TouchableOpacity style={styles.backIcon} onPress={onBackPress}>
      <Icons name="arrow-back" size={FontSize.xl} color={Colors.White} />
    </TouchableOpacity>
    <Image
      source={{uri: image || 'https://via.placeholder.com/300'}}
      style={styles.image}
    />
    <View style={styles.overlay} />
  </View>
);

// const GenreList = ({genres}: {genres: string[]}) => (
//   <FlatList
//     horizontal
//     data={genres}
//     keyExtractor={item => item}
//     renderItem={({item}) => (
//       <AAButton
//         title={item}
//         ignoreTheme
//         onPress={() => {}}
//         style={styles.genreButton}
//         textStyle={styles.genreText}
//       />
//     )}
//     showsHorizontalScrollIndicator={false}
//     contentContainerStyle={styles.genreListContainer}
//   />
// );

const DetailScreen = ({route}: DetailScreenProps) => {
  const {id} = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);
  const {addToList, removeFromList, isInList} = useMyList();
  const [isSheetVisible, setIsSheetVisible] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const onRefresh = async () => {
    setLoading(true);
    await fetchAnimeInfo();
    setLoading(false);
  };

  const toggleBottomSheet = () => {
    if (isSheetVisible) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.expand();
    }
    setIsSheetVisible(!isSheetVisible);
  };

  const renderDescription = () => {
    if (!animeInfo?.description) {
      return null;
    }

    const truncatedDescription =
      animeInfo.description.length > 250
        ? `${animeInfo.description.slice(0, 250)}`
        : animeInfo.description;

    return (
      <View>
        {/* <AAText style={styles.genres}>
          genres: {animeInfo.genres.join(', ')}
        </AAText> */}
        <TouchableOpacity onPress={toggleBottomSheet}>
          <AAText style={styles.descriptionText}>
            {truncatedDescription}
            {animeInfo.description.length > 250 && (
              <AAText ignoretheme style={styles.viewMoreText}>
                ...View More
              </AAText>
            )}
          </AAText>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <SkeletonDetail />
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[Colors.Pink]}
          />
        }>
        <Banner
          image={animeInfo?.image}
          onBackPress={() => navigation.goBack()}
        />

        <View style={styles.row}>
          <AAText style={styles.titleText}>
            {trimTitle(animeInfo?.title || '', 42)}
          </AAText>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handlePress()}>
              {isInMyList ? (
                <Icons
                  size={FontSize.xl}
                  name="bookmark-outline"
                  color={Colors.Pink}
                />
              ) : (
                <Icons
                  size={FontSize.xl}
                  name="bookmark-outline"
                  color={theme.colors.text}
                />
              )}
            </TouchableOpacity>
            <Icons
              size={FontSize.xl}
              name="share-social-outline"
              color={theme.colors.text}
            />
          </View>
        </View>

        {/* <View style={styles.row}>
          <View style={styles.infoContainer}>
            <AAText style={styles.statusText}>{animeInfo?.releaseDate}</AAText>
            <AAText style={styles.statusText}>{animeInfo?.status}</AAText>
          </View>
        </View> */}

        <View style={styles.controllerRow}>
          <AAButton
            title="Play"
            ignoreTheme
            onPress={() => {}}
            textStyle={styles.buttonTextAlt}
            style={[styles.buttonAlt, styles.controllerButton]}
            icon={
              <Icons
                name="play-circle"
                size={FontSize.md}
                color={Colors.White}
              />
            }
          />
          <AAButton
            ignoreTheme
            title="Download"
            onPress={() => {}}
            textStyle={styles.buttonText}
            style={[styles.button, styles.controllerButton]}
            icon={
              <Icons name="download" size={FontSize.md} color={Colors.Pink} />
            }
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
      {isSheetVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            bottomSheetRef.current?.close();
            setIsSheetVisible(false);
          }}
          style={styles.overlay}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        handleIndicatorStyle={{backgroundColor: theme.colors.text}}
        handleStyle={[styles.bar, {backgroundColor: theme.colors.background}]}
        onClose={() => setIsSheetVisible(false)}>
        <BottomSheetView
          style={[styles.sheet, {backgroundColor: theme.colors.background}]}>
          <AAText style={styles.descriptionText}>
            {animeInfo?.description}
          </AAText>
        </BottomSheetView>
      </BottomSheet>
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: Platform.OS === 'ios' ? 10 : 0},
  descriptionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    lineHeight: 20,
    fontSize: FontSize.xs,
  },
  genres: {
    fontSize: FontSize.xs,
    paddingBottom: 10,
  },
  description: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  viewMoreText: {
    color: Colors.Pink,
    fontSize: FontSize.xs,
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  controllerRow: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  iconContainer: {
    gap: 20,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: FontSize.md,
    maxWidth: '70%',
    fontWeight: '600',
  },
  statusText: {
    fontSize: FontSize.sm,
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
    height: 40,
    padding: -10,
    justifyContent: 'center',
    borderColor: Colors.Pink,
  },
  buttonAlt: {
    borderRadius: 10,
    height: 40,
    padding: -10,
    borderColor: Colors.Pink,
    backgroundColor: Colors.Pink,
  },
  buttonText: {
    color: Colors.Pink,
    fontSize: FontSize.sm,
  },
  controllerButton: {
    width: '48%',
    borderRadius: 20,
  },
  buttonTextAlt: {
    color: Colors.White,
    fontSize: FontSize.sm,
  },
  infoContainer: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    padding: 20,
  },
  bar: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default DetailScreen;

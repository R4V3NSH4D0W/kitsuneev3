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
import {
  Anime,
  JikanAnimeResponse,
  RootStackParamList,
} from '../constants/types';

import AnimeCard from '../components/AnimeCard';
import EpisodeCard from '../components/episodes-card';

import {getAnimeDetail, jikanAnime} from '../helper/api.helper';
import {useMyList} from '../helper/storage.helper';
import {trimRating, trimTitle} from '../helper/util.helper';
import SkeletonDetail from '../utils/skeleton-loaders/detail-skeleton';
import {RefreshControl} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import AIcons from 'react-native-vector-icons/AntDesign';
import ProviderError from '../components/provider-error';

type DetailScreenProps = {
  route: RouteProp<RootStackParamList, 'Detail'>;
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
      <Icons name="arrow-back" size={FontSize.xl} color={Colors.White} />
    </TouchableOpacity>
    <Image
      source={{uri: image || 'https://via.placeholder.com/300'}}
      style={styles.image}
    />
    <View style={styles.overlay} />
  </View>
);

const DetailScreen = ({route}: DetailScreenProps) => {
  const {id} = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);

  const {addToList, removeFromList, isInList} = useMyList();
  const [isSheetVisible, setIsSheetVisible] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const {theme} = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const fetchAnimeInfo = useCallback(async () => {
    setLoading(true);
    try {
      const result: Anime = await getAnimeDetail(id);
      const jikanResult: JikanAnimeResponse = await jikanAnime(result.malID);

      setAnimeInfo({...result, jikan: jikanResult || null});
    } catch (error) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnimeInfo();
  }, [id, fetchAnimeInfo]);

  const onRefresh = async () => {
    console.log('triggred');
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

  if (hasError) {
    return <ProviderError hasRetry={false} />;
  }

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

  const handelPlay = () => {
    return navigation.navigate('VideoScreen', {
      id: animeInfo?.episodes[0].id,
      episodeNumber: animeInfo?.episodes[0].number,
    });
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
        {!animeInfo?.jikan?.data?.score ? null : (
          <View style={styles.labelContainer}>
            <View style={styles.labelContent}>
              <AIcons name="star" size={FontSize.md} color={Colors.Pink} />
              <AAText ignoretheme style={styles.label}>
                {animeInfo?.jikan?.data?.score}
              </AAText>
              <AAText ignoretheme style={styles.label}>
                {'>'}
              </AAText>
            </View>
            <AAText style={styles.label}>{animeInfo?.jikan?.data?.year}</AAText>
            <AAText ignoretheme style={[styles.label, styles.labelRating]}>
              {trimRating(animeInfo?.jikan?.data?.rating)}
            </AAText>
          </View>
        )}

        <View style={styles.controllerRow}>
          <AAButton
            title="Play"
            ignoreTheme
            onPress={() => {
              handelPlay();
            }}
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

        <View style={styles.description}>
          {!animeInfo?.jikan?.data?.genres ? null : (
            <AAText style={styles.genreText}>
              Genres: {''}
              {animeInfo?.jikan?.data.genres
                .map(genre => genre?.name)
                .join(', ')}
            </AAText>
          )}

          {renderDescription()}
        </View>
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
    flexDirection: 'row',
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
    fontSize: FontSize.xs,
    marginBottom: 4,
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
  label: {
    fontSize: FontSize.sm,
    color: Colors.Pink,
  },
  labelContent: {
    flexDirection: 'row',

    gap: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  labelRating: {
    borderWidth: 1,
    paddingHorizontal: 8,
    borderColor: Colors.Pink,
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default DetailScreen;

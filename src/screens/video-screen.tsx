/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {Anime, RootStackParamList} from '../constants/types';
import LayoutWrapper from '../wrappers/layout-wrapper';
import {getAnimeDetail, getEpisodeSource} from '../helper/api.helper';
import {
  SelectedTrackType,
  TextTrackType,
} from 'react-native-video/lib/types/video';
import AAText from '../ui/text';
import {
  useContinueWatching,
  useWatchedEpisodes,
} from '../helper/storage.helper';
import AIcons from 'react-native-vector-icons/AntDesign';
import {Colors} from '../constants/constants';
import AADropDown from '../utils/dropdown';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../wrappers/theme-context';

const {width} = Dimensions.get('window');

type VideoScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoScreen'>;
};

const VideoScreen: React.FC<VideoScreenProps> = ({route}) => {
  const {id, episodeNumber} = route.params;
  const animeID = id.split('$episode')[0];
  const [episodeSources, setEpisodeSources] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMarkedWatched, setHasMarkedWatched] = useState<boolean>(false);
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigation = useNavigation<StackNavigationProp<any>>();
  const {theme} = useTheme();

  const {markAsWatched, isWatched} = useWatchedEpisodes();
  const {continueWatching, setContinueWatching} = useContinueWatching();

  useEffect(() => {
    if (animeInfo && (!continueWatching || continueWatching.id !== id)) {
      setContinueWatching(id, animeInfo.image, animeInfo.title, episodeNumber);
    }
  }, [animeInfo, continueWatching, setContinueWatching, id, episodeNumber]);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sourceResult, animeInfoResult] = await Promise.all([
        getEpisodeSource(id),
        getAnimeDetail(animeID),
      ]);
      setEpisodeSources(sourceResult || null);
      setAnimeInfo(animeInfoResult || null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, animeID]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getHlsSource = (): string | null => {
    if (!episodeSources || !episodeSources.sources) {
      return null;
    }
    const hlsSource = episodeSources.sources.find(
      (source: any) => source.isM3U8,
    )?.url;
    return hlsSource || null;
  };

  const englishSubtitle = episodeSources?.subtitles?.find(
    (subtitle: any) => subtitle.lang === 'English',
  );

  const handleProgress = async (progress: {
    currentTime: number;
    playableDuration: number;
  }) => {
    if (progress.playableDuration > 0) {
      const playbackPercentage =
        (progress.currentTime / progress.playableDuration) * 100;

      if (playbackPercentage >= 50 && !hasMarkedWatched) {
        try {
          await markAsWatched(id, playbackPercentage);
          setHasMarkedWatched(true);
        } catch (error) {
          console.error('Error marking as watched:', error);
        }
      }
    }
  };

  const renderVideo = () => {
    const hlsSource = getHlsSource();
    if (!hlsSource) {
      return (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.noSourceIndicator}
        />
      );
    }

    return (
      <Video
        source={{
          uri: hlsSource,
          textTracks: [
            {
              title: 'English CC',
              language: 'en',
              type: TextTrackType.VTT,
              uri: englishSubtitle?.url,
            },
          ],
        }}
        style={styles.video}
        controls={true}
        resizeMode="contain"
        onProgress={handleProgress}
        selectedTextTrack={{
          type: SelectedTrackType.INDEX,
          value: 0,
        }}
      />
    );
  };

  const [selectedRange, setSelectedRange] = useState<
    | {
        start: number;
        end: number;
      }
    | undefined
  >(undefined);

  const handleRangeSelected = (range: {start: number; end: number}) => {
    setSelectedRange(range);
  };

  const filteredEpisodes = animeInfo?.episodes?.filter((episode: any) => {
    const matchesSearch = episode.number.toString().includes(searchQuery);

    if (searchQuery) {
      return matchesSearch;
    }

    if (selectedRange && !isLoading) {
      return (
        episode.number >= selectedRange.start &&
        episode.number <= selectedRange.end
      );
    }

    return true;
  });

  if (isLoading) {
    return (
      <LayoutWrapper>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={Colors.Pink}
            style={styles.loadingIndicator}
          />
        </View>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#007bff"
              style={styles.loadingIndicator}
            />
          ) : (
            renderVideo()
          )}
        </View>
        <View
          style={{
            padding: 10,
            alignItems: 'center',
            backgroundColor: Colors.LightGray,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <AAText
            ignoretheme
            style={{
              fontSize: 12,
              color: Colors.White,
              fontWeight: '600',
            }}>
            You are watching
          </AAText>
          <AAText
            ignoretheme
            style={{
              color: Colors.Pink,
              fontSize: 12,
              paddingLeft: 5,
              fontWeight: '600',
            }}>
            Episode {episodeNumber}
          </AAText>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 20,
              alignItems: 'center',
              marginTop: 20,
            }}>
            <View style={{gap: 10, width: '40%'}}>
              <AAText style={{fontSize: 18, fontWeight: '600'}}>
                List of Episodes
              </AAText>
              <AADropDown
                episodes={animeInfo?.episodes || []}
                onRangeSelected={handleRangeSelected}
                selectedRange={selectedRange}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 20,
                padding: Platform.OS === 'ios' ? 10 : 0,
                paddingHorizontal: Platform.OS === 'ios' ? 0 : 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.White,
                borderRadius: 10,
                width: '50%',
              }}>
              <AIcons name="search1" size={20} color={theme.colors.text} />
              <TextInput
                placeholder="Search Ep"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                style={{
                  color: Colors.White,
                  width: '100%',
                  fontSize: 16,
                  letterSpacing: 1,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 20,
              gap: 10,
            }}>
            {filteredEpisodes?.map(item => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('VideoScreen', {
                    id: item.id,
                    episodeNumber: item.number,
                  })
                }
                key={item.id}
                style={{
                  backgroundColor:
                    item.number === episodeNumber
                      ? Colors.Pink
                      : isWatched(item.id)
                      ? Colors.DarkPink
                      : theme.colors.alt,
                  padding: 10,
                  width: (width - 20) / 6,
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <AAText
                  ignoretheme
                  style={{
                    color:
                      item.number === episodeNumber
                        ? Colors.White
                        : theme.colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                  {item.number}
                </AAText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    height: 250,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
  },
  noSourceIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    paddingHorizontal: 20,
  },
});

export default VideoScreen;

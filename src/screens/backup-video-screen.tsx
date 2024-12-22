/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Platform,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Video, {
  VideoRef,
  OnBufferData,
  TextTrackType,
  SelectedTrackType,
} from 'react-native-video';
import AIcons from 'react-native-vector-icons/AntDesign';
import {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Colors, FontSize} from '../constants/constants';
import {Anime, RootStackParamList} from '../constants/types';

import {useTheme} from '../wrappers/theme-context';
import LayoutWrapper from '../wrappers/layout-wrapper';

import {
  useWatchedEpisodes,
  useContinueWatching,
} from '../helper/storage.helper';
import {getAnimeDetail, getEpisodeSource} from '../helper/api.helper';

import AAText from '../ui/text';
import AADropDown from '../utils/dropdown';

const {width} = Dimensions.get('window');

type VideoScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoScreen'>;
};

const VideoScreen: React.FC<VideoScreenProps> = ({route}) => {
  const {id, episodeNumber} = route.params;

  const [currentId, setCurrentId] = useState<string>(id);
  const [currentEpisodeNumber, setCurrentEpisodeNumber] =
    useState<number>(episodeNumber);

  const animeID = currentId.split('$episode')[0];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);

  const [episodeSources, setEpisodeSources] = useState<any | null>(null);
  console.log('episodeSources', episodeSources);
  const [hasMarkedWatched, setHasMarkedWatched] = useState<boolean>(false);

  const {markAsWatched, isWatched} = useWatchedEpisodes();
  const {continueWatching, setContinueWatching} = useContinueWatching();
  console.log('isBuffering', isBuffering);

  const {theme} = useTheme();
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    if (animeInfo && (!continueWatching || continueWatching.id !== currentId)) {
      setContinueWatching(
        currentId,
        animeInfo.image,
        animeInfo.title,
        currentEpisodeNumber,
      );
    }
  }, [
    animeInfo,
    continueWatching,
    setContinueWatching,
    currentId,
    currentEpisodeNumber,
  ]);

  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);

  const fetchAllData = useCallback(async () => {
    try {
      setIsVideoLoading(true);
      const [sourceResult, animeInfoResult] = await Promise.all([
        getEpisodeSource(currentId),
        getAnimeDetail(animeID),
      ]);
      setAnimeInfo(animeInfoResult || null);
      setEpisodeSources(sourceResult || null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsVideoLoading(false);
    }
  }, [currentId, animeID]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleEpisodeSelect = async (episodeId: string, epNumber: number) => {
    try {
      setCurrentId(episodeId);
      setCurrentEpisodeNumber(epNumber);
      setEpisodeSources(null);
      setSelectedEpisode(epNumber);
      await fetchEpisodeSource(episodeId);
    } catch (error) {
      console.error('Error selecting episode:', error);
    }
  };

  const [selectedEpisode, setSelectedEpisode] = useState<number>(episodeNumber);

  const fetchEpisodeSource = useCallback(async (episodeId: string) => {
    try {
      setIsVideoLoading(true);
      const sourceResult = await getEpisodeSource(episodeId);
      setEpisodeSources(sourceResult || null);
    } catch (error) {
      console.error('Error fetching episode source:', error);
    } finally {
      setIsVideoLoading(false);
    }
  }, []);

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
          color={Colors.Pink}
          style={styles.noSourceIndicator}
        />
      );
    }

    const renderLoading = () => {
      console.log('renderLoading triggered');
      return (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      );
    };

    const onVideoBuffer = (param: OnBufferData) => {
      setIsBuffering(param.isBuffering);
    };

    const onReadyForDisplay = () => {
      setIsBuffering(false);
      setIsVideoLoading(false);
    };

    return (
      <View style={styles.videoContainer}>
        {isBuffering && renderLoading()}

        <Video
          style={styles.video}
          ref={videoRef}
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
          controls={true}
          resizeMode="contain"
          onProgress={handleProgress}
          onBuffer={onVideoBuffer}
          onReadyForDisplay={onReadyForDisplay}
          selectedTextTrack={{
            type: SelectedTrackType.INDEX,
            value: 0,
          }}
        />
      </View>
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

    if (selectedRange) {
      return (
        episode.number >= selectedRange.start &&
        episode.number <= selectedRange.end
      );
    }

    return true;
  });

  // if (isLoading) {
  //   return (
  //     <LayoutWrapper>
  //       <View style={styles.container}>
  //         <ActivityIndicator
  //           size="large"
  //           color={Colors.Pink}
  //           style={styles.loadingIndicator}
  //         />
  //       </View>
  //     </LayoutWrapper>
  //   );
  // }

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          {!isVideoLoading && renderVideo()}
        </View>
        <View
          style={{
            padding: 10,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: Colors.LightGray,
          }}>
          <AAText
            ignoretheme
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: Colors.White,
            }}>
            You are watching
          </AAText>
          <AAText
            ignoretheme
            style={{
              fontSize: 12,
              paddingLeft: 5,
              fontWeight: '600',
              color: Colors.Pink,
            }}>
            Episode {selectedEpisode}
          </AAText>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '40%'}}>
                <AAText style={{fontSize: FontSize.xmd, fontWeight: '600'}}>
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
                  gap: 10,
                  width: '50%',
                  borderWidth: 1,
                  borderRadius: 10,
                  marginBottom: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  borderColor: theme.colors.text,
                  padding: Platform.OS === 'ios' ? 10 : 0,
                }}>
                <AIcons name="search1" size={20} color={theme.colors.text} />
                <TextInput
                  value={searchQuery}
                  keyboardType="numeric"
                  placeholder="Search Ep"
                  placeholderTextColor={theme.colors.text}
                  style={{
                    width: '100%',
                    letterSpacing: 1,
                    color: theme.colors.text,
                    fontSize: FontSize.sm,
                  }}
                  onChangeText={text => setSearchQuery(text)}
                />
              </View>
            </View>
            <View
              style={{
                gap: 10,
                marginTop: 20,
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}>
              {filteredEpisodes?.map(item => (
                <TouchableOpacity
                  onPress={() => handleEpisodeSelect(item.id, item.number)}
                  key={item.id}
                  style={{
                    backgroundColor:
                      item.number === selectedEpisode
                        ? Colors.Pink
                        : isWatched(item.id)
                        ? Colors.DarkPink
                        : theme.colors.alt,
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    width: (width - 20) / 6,
                  }}>
                  <AAText
                    ignoretheme
                    style={{
                      color:
                        item.number === episodeNumber
                          ? Colors.White
                          : isWatched(item.id)
                          ? Colors.White
                          : theme.colors.text,
                      fontWeight: '600',
                      fontSize: FontSize.sm,
                    }}>
                    {item.number}
                  </AAText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{marginBottom: 20}}>
            {/* <AnimeCard
                title="Related Anime"
                data={animeInfo?.recommendations || []}
                hideSeeAll
              /> */}
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
    height: 350,
    position: 'relative',
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  video: {
    flex: 1,

    zIndex: 10,
  },
  noSourceIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 15,
  },
});

export default VideoScreen;
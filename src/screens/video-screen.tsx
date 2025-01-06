// VideoScreen.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AIcons from 'react-native-vector-icons/AntDesign';
import {RouteProp} from '@react-navigation/native';
import {Colors, FontSize} from '../constants/constants';
import {Anime, RootStackParamList} from '../constants/types';
import {useTheme} from '../wrappers/theme-context';
import LayoutWrapper from '../wrappers/layout-wrapper';
import {
  useWatchedEpisodes,
  useContinueWatching,
} from '../helper/storage.helper';
import AAText from '../ui/text';
import AADropDown from '../utils/dropdown';
import {fetchAnimeAndEpisodeData} from '../helper/video-player-helper';
import EpisodeLists from '../components/episode-lists';
import ProviderError from '../components/provider-error';
import VideoPlayer from '../components/video-player';

type VideoScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoScreen'>;
};

const VideoScreen: React.FC<VideoScreenProps> = ({route}) => {
  const {id, episodeNumber} = route.params;
  const [epsNo, setEpsNo] = useState(episodeNumber);
  const [animeEpisodeId, setAnimeEpisodeId] = useState<string>(id);
  const animeID = animeEpisodeId.split('$episode')[0];
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBuffering, setIsBuffering] = useState(false);
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);
  const [episodeSources, setEpisodeSources] = useState<any | null>(null);
  const [hasMarkedWatched, setHasMarkedWatched] = useState(false);
  const [selectedRange, setSelectedRange] = useState<
    {start: number; end: number} | undefined
  >(undefined);
  const [hasError, setHasError] = useState<boolean>(false);
  const {markAsWatched} = useWatchedEpisodes();
  const {continueWatching, setContinueWatching} = useContinueWatching();
  const {theme} = useTheme();

  useEffect(() => {
    if (
      animeInfo &&
      (!continueWatching || continueWatching.id !== animeEpisodeId)
    ) {
      setContinueWatching(
        animeEpisodeId,
        animeInfo.image,
        animeInfo.title,
        epsNo,
      );
    }
  }, [animeInfo, continueWatching, setContinueWatching, animeEpisodeId, epsNo]);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const {
        episodeSources: fetchedEpisodeSources,
        animeInfo: fetchedAnimeInfo,
      } = await fetchAnimeAndEpisodeData(animeID, animeEpisodeId);
      setAnimeInfo(fetchedAnimeInfo || null);
      setEpisodeSources(fetchedEpisodeSources || null);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [animeID, animeEpisodeId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleProgress = async (progress: {
    currentTime: number;
    playableDuration: number;
  }) => {
    if (progress.playableDuration > 0) {
      const playbackPercentage =
        (progress.currentTime / progress.playableDuration) * 100;
      if (playbackPercentage >= 50 && !hasMarkedWatched) {
        try {
          await markAsWatched(animeEpisodeId, playbackPercentage);
          setHasMarkedWatched(true);
        } catch (error) {
          console.error('Error marking as watched:', error);
        }
      }
    }
  };

  const handelEpisodeChange = (episodeId: string, episodeNo: number) => {
    setIsBuffering(true);
    setEpsNo(episodeNo);
    setAnimeEpisodeId(episodeId);
    setHasMarkedWatched(false);
  };

  if (hasError) {
    return <ProviderError hasRetry={false} />;
  }

  // const renderLoading = () => (
  //   <View style={styles.bufferingIndicator}>
  //     <ActivityIndicator size="large" color={Colors.Pink} />
  //   </View>
  // );

  const filteredEpisodes = animeInfo?.episodes?.filter(episode => {
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

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={Colors.Pink} />
          </View>
        ) : (
          <VideoPlayer
            episodeSources={episodeSources}
            isBuffering={isBuffering}
            setIsBuffering={setIsBuffering}
            onProgress={handleProgress}
          />
        )}
        <View style={styles.episodeHeader}>
          <AAText ignoretheme style={styles.headerText}>
            You are watching
          </AAText>
          <AAText ignoretheme style={styles.headerEpisode}>
            Episode {epsNo}
          </AAText>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.searchSection}>
              <View style={styles.dropdownContainer}>
                <AAText style={styles.dropdownText}>List of Episodes</AAText>
                <AADropDown
                  episodes={animeInfo?.episodes || []}
                  onRangeSelected={setSelectedRange}
                  selectedRange={selectedRange}
                />
              </View>
              <View style={styles.searchInputContainer}>
                <AIcons name="search1" size={20} color={theme.colors.text} />
                <TextInput
                  value={searchQuery}
                  keyboardType="numeric"
                  placeholder="Search Ep"
                  placeholderTextColor={theme.colors.text}
                  style={[styles.searchInput, {color: theme.colors.text}]}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
            <EpisodeLists
              filteredEpisodes={filteredEpisodes || []}
              episodeNumber={epsNo}
              onEpisodeSelect={handelEpisodeChange}
            />
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
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
    backgroundColor: '#000',
  },
  bufferingIndicator: {
    position: 'absolute',
    zIndex: 999,
    left: '45%',
  },
  episodeHeader: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.LightGray,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.White,
  },
  headerEpisode: {
    fontSize: 12,
    paddingLeft: 5,
    fontWeight: '600',
    color: Colors.Pink,
  },
  contentContainer: {
    padding: 15,
  },
  searchSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    width: '40%',
  },
  dropdownText: {
    fontSize: FontSize.xmd,
    fontWeight: '600',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '50%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: Colors.LightGray,
  },
  searchInput: {
    flex: 1,
    letterSpacing: 1,
    fontSize: FontSize.sm,
  },
});

export default VideoScreen;

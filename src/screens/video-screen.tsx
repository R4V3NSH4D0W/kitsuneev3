import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import Video from 'react-native-video';
import {RouteProp} from '@react-navigation/native';
import {Anime, RootStackParamList} from '../constants/types';
import LayoutWrapper from '../wrappers/layout-wrapper';
import {getAnimeDetail, getEpisodeSource} from '../helper/api.helper';
import {
  SelectedTrackType,
  TextTrackType,
} from 'react-native-video/lib/types/video';
import {useWatchedEpisodes} from '../helper/storage.helper';

type VideoScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoScreen'>;
};

const VideoScreen: React.FC<VideoScreenProps> = ({route}) => {
  const {id} = route.params;
  const animeID = id.split('$episode')[0];
  console.log(animeID);
  const [episodeSources, setEpisodeSources] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMarkedWatched, setHasMarkedWatched] = useState<boolean>(false);
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);
  console.log(animeInfo);

  const {markAsWatched} = useWatchedEpisodes();

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
});

export default VideoScreen;

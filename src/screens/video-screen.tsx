import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import Video from 'react-native-video';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../constants/types';
import LayoutWrapper from '../wrappers/layout-wrapper';
import {getEpisodeSource} from '../helper/api.helper';
import {
  SelectedTrackType,
  TextTrackType,
} from 'react-native-video/lib/types/video';

type VideoScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoScreen'>;
};

const VideoScreen: React.FC<VideoScreenProps> = ({route}) => {
  const {id} = route.params;
  const [episodeSources, setEpisodeSources] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [isBuffering, setIsBuffering] = useState<boolean>(false);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const sources = await getEpisodeSource(id);
        setEpisodeSources(sources);
      } catch (error) {
        console.error('Error fetching episode sources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSources();
  }, [id]);

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

  // const handleBufferingStart = () => {
  //   setIsBuffering(true);
  // };

  // const handleBufferingEnd = () => {
  //   setIsBuffering(false);
  // };

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
        paused={false}
        // onLoad={handleBufferingEnd}
        // onLoadStart={handleBufferingEnd}
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

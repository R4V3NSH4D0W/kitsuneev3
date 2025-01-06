import React, {useRef} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Video, {
  VideoRef,
  OnBufferData,
  TextTrackType,
  SelectedTrackType,
} from 'react-native-video';
import {Colors} from '../constants/constants';
import {findEnglishSubtitle, getHlsSource} from '../helper/video-player-helper';

type VideoPlayerProps = {
  episodeSources: any;
  isBuffering: boolean;
  setIsBuffering: React.Dispatch<React.SetStateAction<boolean>>;
  onProgress: (progress: {
    currentTime: number;
    playableDuration: number;
  }) => void;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  episodeSources,
  isBuffering,
  setIsBuffering,
  onProgress,
}) => {
  const videoRef = useRef<VideoRef>(null);

  const hlsSource = getHlsSource(episodeSources);
  if (!hlsSource) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.Pink}
        style={styles.noSourceIndicator}
      />
    );
  }

  const englishSubtitle = findEnglishSubtitle(episodeSources?.subtitles || []);

  return (
    <View style={styles.videoContainer}>
      {isBuffering && (
        <View style={styles.bufferingIndicator}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      )}
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
        controls
        resizeMode="contain"
        // eslint-disable-next-line react-native/no-inline-styles
        controlsStyles={{
          hideNext: true,
          hidePrevious: true,
        }}
        onProgress={onProgress}
        onBuffer={(param: OnBufferData) => setIsBuffering(param.isBuffering)}
        onReadyForDisplay={() => setIsBuffering(false)}
        subtitleStyle={styles.subTitle}
        selectedTextTrack={{type: SelectedTrackType.INDEX, value: 0}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: 350,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
  },
  bufferingIndicator: {
    position: 'absolute',
    zIndex: 999,
    left: '45%',
  },
  noSourceIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    paddingBottom: 20,
  },
});

export default VideoPlayer;

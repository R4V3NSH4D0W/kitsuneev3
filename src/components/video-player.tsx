import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  BackHandler,
} from 'react-native';
import Video, {
  VideoRef,
  OnBufferData,
  TextTrackType,
  SelectedTrackType,
} from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, FontSize} from '../constants/constants';
import {findEnglishSubtitle, getHlsSource} from '../helper/video-player-helper';
import Slider from '@react-native-community/slider';
import FIcon from 'react-native-vector-icons/Feather';
import AAText from '../ui/text';
import SystemNavigationBar from 'react-native-system-navigation-bar';

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [lastPressTime, setLastPressTime] = useState(0);

  const hideTimer = useRef<any>(null);

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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.resume();
    }
    resetHideTimer();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);

    if (!isFullScreen) {
      StatusBar.setHidden(true);
      SystemNavigationBar.navigationHide();
    } else {
      StatusBar.setHidden(false);
      SystemNavigationBar.navigationShow();
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const onBackPress = () => {
      if (isFullScreen) {
        setIsFullScreen(false);
        StatusBar.setHidden(false);
        SystemNavigationBar.navigationShow();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [isFullScreen]);

  const handleProgress = (progress: {
    currentTime: number;
    playableDuration: number;
  }) => {
    setCurrentTime(progress.currentTime);
    onProgress(progress);
    resetHideTimer();
  };

  const handleLoad = (data: any) => {
    setDuration(data.duration);
  };

  const handleEnd = () => {
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  const handleForward = () => {
    const newTime = currentTime + 10;
    if (newTime < duration) {
      setCurrentTime(newTime);
      videoRef.current?.seek(newTime);
    } else {
      videoRef.current?.seek(duration);
    }
    resetHideTimer();
  };

  const handleBackward = () => {
    const newTime = currentTime - 10;
    if (newTime > 0) {
      setCurrentTime(newTime);
      videoRef.current?.seek(newTime);
    } else {
      videoRef.current?.seek(0);
    }
    resetHideTimer();
  };

  const resetHideTimer = () => {
    if (isInteracting) {
      return;
    }
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleVideoPress = () => {
    const time = new Date().getTime();
    if (time - lastPressTime < 3000) {
      setShowControls(prev => !prev);
    } else {
      setShowControls(true);
    }
    setLastPressTime(time);
    resetHideTimer();
  };

  const handleSlidingStart = () => {
    setIsInteracting(true);
    clearTimeout(hideTimer.current);
  };

  const handleSlidingComplete = (value: number) => {
    setIsInteracting(false);
    videoRef.current?.seek(value);
    resetHideTimer();
  };

  return (
    <View
      style={[styles.videoContainer, isFullScreen ? styles.fullScreen : {}]}>
      {isBuffering && (
        <View style={styles.bufferingIndicator}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      )}
      <TouchableWithoutFeedback onPress={handleVideoPress} style={styles.video}>
        <Video
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
          style={styles.video}
          resizeMode="contain"
          controls={false}
          onProgress={handleProgress}
          onBuffer={(param: OnBufferData) => setIsBuffering(param.isBuffering)}
          onReadyForDisplay={() => setIsBuffering(false)}
          onEnd={handleEnd}
          onLoad={handleLoad}
          subtitleStyle={styles.subTitle}
          selectedTextTrack={{type: SelectedTrackType.INDEX, value: 0}}
        />
      </TouchableWithoutFeedback>

      {showControls && (
        <View style={styles.controlsContainer}>
          <View style={styles.videoControls}>
            <TouchableOpacity onPress={handleBackward}>
              <Icon name="backward" size={20} color={Colors.White} />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
              <FIcon
                name={isPlaying ? 'pause' : 'play'}
                size={20}
                color={Colors.White}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleForward}>
              <Icon name="forward" size={20} color={Colors.White} />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderContent}>
            <AAText ignoretheme style={styles.time}>
              {formatTime(currentTime)}
            </AAText>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onSlidingStart={handleSlidingStart}
              onSlidingComplete={handleSlidingComplete}
              minimumTrackTintColor={Colors.Pink}
              maximumTrackTintColor={Colors.White}
              thumbTintColor={Colors.Pink}
            />
            <View style={styles.rightSlider}>
              <AAText ignoretheme style={styles.time}>
                {formatTime(duration)}
              </AAText>
              <TouchableOpacity onPress={toggleFullScreen}>
                <Icon name="expand" size={20} color={Colors.White} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: 350,
    backgroundColor: '#000',
    justifyContent: 'center',
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
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
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  sliderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    width: '100%',
  },
  slider: {
    width: '70%',
    marginVertical: 5,
  },
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  time: {
    color: Colors.White,
    fontSize: FontSize.sm,
  },
  rightSlider: {
    flexDirection: 'row',
    gap: 20,
  },
  videoControls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingVertical: 10,
  },
  thumbStyle: {
    height: 5,
  },
});

export default VideoPlayer;
